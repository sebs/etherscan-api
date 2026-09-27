import https from 'node:https';
import http from 'node:http';
import type { IncomingMessage } from 'node:http';
import { EtherscanHttpError } from './errors.js';
import { etherscanMessage } from './response.js';
import type { Transport, EtherscanResponse } from './types.js';

/** Default request timeout in milliseconds. */
const DEFAULT_TIMEOUT = 10000;

/** Node's timers cap at 2^31-1 ms; anything larger fires after 1 ms instead. */
const MAX_TIMEOUT = 2 ** 31 - 1;

/**
 * Resolve a caller-supplied timeout: `undefined`/`null` mean the 10 s default,
 * anything else must be a positive, finite number of milliseconds within Node's
 * timer range. A numeric string (e.g. straight from `process.env`) is accepted.
 * @throws {Error} If the timeout is invalid.
 */
export function resolveTimeout(timeout: number | string | undefined | null): number {
  if (timeout === undefined || timeout === null) return DEFAULT_TIMEOUT;
  const ms = typeof timeout === 'string' && /^\s*\d+(\.\d+)?\s*$/.test(timeout) ? Number(timeout) : timeout;
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0 || ms > MAX_TIMEOUT) {
    const shown = typeof timeout === 'string' ? JSON.stringify(timeout) : String(timeout);
    throw new Error(
      `Invalid timeout ${shown} (${typeof timeout}): expected a positive number of milliseconds up to ${MAX_TIMEOUT}.`,
    );
  }
  return ms;
}

/** Default cap on the response body size (50 MB). See `maxResponseBytes`. */
const DEFAULT_MAX_RESPONSE_BYTES = 50 * 1024 * 1024;

/**
 * Default HTTP transport: performs a GET (or POST, for verification endpoints)
 * and resolves the parsed JSON body. Uses only Node built-ins — no third-party
 * HTTP client. Callers can supply their own transport with the same signature as
 * the 4th argument to {@link init}.
 */
/**
 * The Etherscan error message carried by a non-2xx body, formatted for
 * appending to the status-code error. Returns '' unless the body parses as a
 * JSON object with a non-empty `result` or `message` string.
 */
function errorDetail(body: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return '';
  }
  const detail = etherscanMessage(parsed);
  return detail ? ': ' + detail : '';
}

const httpTransport: Transport = function httpTransport(url, options) {
  let timeout: number;
  try {
    timeout = resolveTimeout(options && options.timeout);
  } catch (err) {
    return Promise.reject(err);
  }
  const method = (options && options.method) || 'GET';
  const body = options && options.body;
  // `??`, not `||`: an explicit 0 ("reject any body") must not become 50 MB.
  const maxResponseBytes = (options && options.maxResponseBytes) ?? DEFAULT_MAX_RESPONSE_BYTES;
  if (typeof maxResponseBytes !== 'number' || Number.isNaN(maxResponseBytes) || maxResponseBytes < 0) {
    return Promise.reject(
      new Error(`Invalid maxResponseBytes ${String(maxResponseBytes)}: expected a non-negative number of bytes.`),
    );
  }
  const allowInsecure = !!(options && options.allowInsecure);

  return new Promise((resolve, reject) => {
    // Settle exactly once. A size-cap abort, a socket error, and the 'end'
    // handler can otherwise race: without this guard an aborted request could
    // still resolve truncated data, or reject and then resolve (double-settle).
    let settled = false;
    let deadline: NodeJS.Timeout | undefined;
    const fail = (err: Error): void => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      reject(err);
    };
    const succeed = (value: EtherscanResponse): void => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      resolve(value);
    };

    // Resolve the scheme via URL parsing so the cleartext refusal is robust to
    // case and leading whitespace (e.g. 'HTTP://' / ' http://' are still http).
    let protocol: string;
    try {
      protocol = new URL(url).protocol;
    } catch {
      fail(new Error('Invalid request URL'));
      return;
    }
    if (protocol !== 'https:' && protocol !== 'http:') {
      fail(new Error('Unsupported URL protocol (expected https: or http:)'));
      return;
    }
    const isHttp = protocol === 'http:';
    if (isHttp && !allowInsecure) {
      // Refuse cleartext by default: the API key rides in the URL/query, so an
      // accidental http:// base must not transmit it unencrypted. The message
      // deliberately omits the URL to avoid leaking the key.
      fail(new Error('Refusing to send request over cleartext http:// (set allowInsecure to override)'));
      return;
    }
    const lib = isHttp ? http : https;

    const headers: Record<string, string | number> = {};
    if (method === 'POST' && body !== undefined) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = lib.request(url, { method, headers }, (res: IncomingMessage) => {
      const status = res.statusCode || 0;
      let data = '';
      let received = 0;

      res.setEncoding('utf8');
      // Without this, an error re-emitted on the response stream (e.g. from the
      // abort below or a mid-stream socket failure) would go unhandled and crash
      // the process.
      res.on('error', fail);
      res.on('data', (chunk: string) => {
        if (settled) return;
        received += Buffer.byteLength(chunk);
        if (received > maxResponseBytes) {
          // Stop buffering and abort. Destroy without an error argument so no
          // 'error' is re-emitted; we reject explicitly via fail().
          res.destroy();
          fail(new Error('Response body exceeded maximum size of ' + maxResponseBytes + ' bytes'));
          return;
        }
        data += chunk;
      });
      res.on('end', () => {
        if (settled) return;
        if (status < 200 || status >= 300) {
          // Etherscan can answer non-2xx with its normal error body (a 403
          // carrying "Max rate limit reached", say). Surface that message
          // instead of discarding it. Only a parsed JSON object's own `result`
          // or `message` string is appended, so an HTML error page cannot echo
          // the request URL — and with it the API key — into the error.
          fail(
            new EtherscanHttpError(
              'Request failed with status code ' + status + errorDetail(data),
              status,
              res.headers,
            ),
          );
          return;
        }
        try {
          succeed(JSON.parse(data));
        } catch (err) {
          fail(new Error('Failed to parse response body: ' + (err as Error).message));
        }
      });
    });

    req.on('error', fail);
    // A wall-clock deadline for the whole exchange. A socket timeout only fires
    // after `timeout` ms of inactivity, so a server trickling bytes could hold
    // the request open indefinitely.
    deadline = setTimeout(() => {
      fail(new Error('Request timed out after ' + timeout + 'ms'));
      req.destroy();
    }, timeout);

    if (method === 'POST' && body !== undefined) {
      req.write(body);
    }
    req.end();
  });
};

export default httpTransport;
