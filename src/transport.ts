import https from 'node:https';
import http from 'node:http';
import type { IncomingHttpHeaders, IncomingMessage } from 'node:http';
import { EtherscanHttpError } from './errors.js';
import { etherscanMessage } from './response.js';
import { resolveMaxResponseBytes, resolveTimeout } from './validation.js';
import type { Transport, TransportOptions, EtherscanResponse } from './types.js';

/** Transport options with defaults applied and values validated. */
interface ResolvedOptions {
  timeout: number;
  maxResponseBytes: number;
  method: 'GET' | 'POST';
  body?: string;
  allowInsecure: boolean;
}

/** A complete HTTP response: status, headers and the whole (size-capped) body. */
interface RawResponse {
  status: number;
  headers: IncomingHttpHeaders;
  body: string;
}

/**
 * Apply the defaults and validate the caller's options.
 * @throws {EtherscanArgumentError} For an invalid timeout or maxResponseBytes.
 */
function resolveOptions(options: TransportOptions = {}): ResolvedOptions {
  return {
    timeout: resolveTimeout(options.timeout),
    maxResponseBytes: resolveMaxResponseBytes(options.maxResponseBytes),
    method: options.method || 'GET',
    body: options.body,
    allowInsecure: !!options.allowInsecure,
  };
}

/**
 * Pick `node:https` or `node:http` for a URL. The scheme comes from URL
 * parsing, so the cleartext refusal is robust to case and leading whitespace
 * (`'HTTP://'` and `' http://'` are still http).
 * @throws {Error} For an unparseable URL, a non-HTTP scheme, or `http:` without `allowInsecure`.
 */
function clientFor(url: string, allowInsecure: boolean): typeof https | typeof http {
  let protocol: string;
  try {
    protocol = new URL(url).protocol;
  } catch {
    throw new Error('Invalid request URL');
  }
  if (protocol === 'https:') return https;
  if (protocol !== 'http:') {
    throw new Error('Unsupported URL protocol (expected https: or http:)');
  }
  if (!allowInsecure) {
    // Refuse cleartext by default: the API key rides in the URL/query, so an
    // accidental http:// base must not transmit it unencrypted. The message
    // deliberately omits the URL to avoid leaking the key.
    throw new Error('Refusing to send request over cleartext http:// (set allowInsecure to override)');
  }
  return http;
}

/** The form-body headers a POST needs; none for a GET. */
function requestHeaders(options: ResolvedOptions): Record<string, string | number> {
  if (options.method !== 'POST' || options.body === undefined) return {};
  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(options.body),
  };
}

/**
 * Send one request and read the whole response body, within a wall-clock
 * deadline and a body-size cap.
 */
function exchange(client: typeof https | typeof http, url: string, options: ResolvedOptions): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    // A size-cap abort, a socket error, the deadline and 'end' can race.
    // `done` makes the first one win: it stops buffering, clears the deadline,
    // and keeps an aborted request from resolving truncated data.
    let done = false;
    let deadline: NodeJS.Timeout | undefined;
    const finish = (settle: () => void): void => {
      if (done) return;
      done = true;
      clearTimeout(deadline);
      settle();
    };
    const fail = (err: Error): void => finish(() => reject(err));

    const req = client.request(url, { method: options.method, headers: requestHeaders(options) }, (res: IncomingMessage) => {
      let body = '';
      let received = 0;

      res.setEncoding('utf8');
      // Without this, an error re-emitted on the response stream (e.g. from the
      // abort below or a mid-stream socket failure) would go unhandled and crash
      // the process.
      res.on('error', fail);
      res.on('data', (chunk: string) => {
        if (done) return;
        received += Buffer.byteLength(chunk);
        if (received > options.maxResponseBytes) {
          // Stop buffering and abort. Destroy without an error argument so no
          // 'error' is re-emitted; we reject explicitly via fail().
          res.destroy();
          fail(new Error('Response body exceeded maximum size of ' + options.maxResponseBytes + ' bytes'));
          return;
        }
        body += chunk;
      });
      res.on('end', () => finish(() => resolve({ status: res.statusCode || 0, headers: res.headers, body })));
    });

    req.on('error', fail);
    // A wall-clock deadline for the whole exchange. A socket timeout only fires
    // after `timeout` ms of inactivity, so a server trickling bytes could hold
    // the request open indefinitely.
    deadline = setTimeout(() => {
      fail(new Error('Request timed out after ' + options.timeout + 'ms'));
      req.destroy();
    }, options.timeout);

    if (options.method === 'POST' && options.body !== undefined) {
      req.write(options.body);
    }
    req.end();
  });
}

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

/**
 * Turn a complete response into the parsed JSON body.
 * @throws {EtherscanHttpError} For a non-2xx status.
 * @throws {Error} When the body is not valid JSON.
 */
function parseResponse({ status, headers, body }: RawResponse): EtherscanResponse {
  if (status < 200 || status >= 300) {
    // Etherscan can answer non-2xx with its normal error body (a 403 carrying
    // "Max rate limit reached", say). Surface that message instead of
    // discarding it. Only a parsed JSON object's own `result` or `message`
    // string is appended, so an HTML error page cannot echo the request URL,
    // and with it the API key, into the error.
    throw new EtherscanHttpError('Request failed with status code ' + status + errorDetail(body), status, headers);
  }
  try {
    return JSON.parse(body);
  } catch (err) {
    throw new Error('Failed to parse response body: ' + (err as Error).message);
  }
}

/**
 * Default HTTP transport: performs a GET (or POST, for verification endpoints)
 * and resolves the parsed JSON body. Uses only Node built-ins — no third-party
 * HTTP client. Callers can supply their own transport with the same signature as
 * the 4th argument to {@link init}.
 */
const httpTransport: Transport = async function httpTransport(url, options) {
  const resolved = resolveOptions(options);
  const client = clientFor(url, resolved.allowInsecure);
  return parseResponse(await exchange(client, url, resolved));
};

export default httpTransport;
