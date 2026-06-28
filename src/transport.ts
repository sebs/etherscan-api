import https from 'node:https';
import http from 'node:http';
import type { IncomingMessage } from 'node:http';
import type { Transport, EtherscanResponse } from './types.js';

/** Default cap on the response body size (50 MB). See `maxResponseBytes`. */
const DEFAULT_MAX_RESPONSE_BYTES = 50 * 1024 * 1024;

/**
 * Default HTTP transport: performs a GET (or POST, for verification endpoints)
 * and resolves the parsed JSON body. Uses only Node built-ins — no third-party
 * HTTP client. Callers can supply their own transport with the same signature as
 * the 4th argument to {@link init}.
 */
const httpTransport: Transport = function httpTransport(url, options) {
  const timeout = (options && options.timeout) || 10000;
  const method = (options && options.method) || 'GET';
  const body = options && options.body;
  const maxResponseBytes = (options && options.maxResponseBytes) || DEFAULT_MAX_RESPONSE_BYTES;
  const allowInsecure = !!(options && options.allowInsecure);

  return new Promise((resolve, reject) => {
    // Settle exactly once. A size-cap abort, a socket error, and the 'end'
    // handler can otherwise race: without this guard an aborted request could
    // still resolve truncated data, or reject and then resolve (double-settle).
    let settled = false;
    const fail = (err: Error): void => {
      if (settled) return;
      settled = true;
      reject(err);
    };
    const succeed = (value: EtherscanResponse): void => {
      if (settled) return;
      settled = true;
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

    const req = lib.request(url, { method, headers, timeout }, (res: IncomingMessage) => {
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
          fail(new Error('Request failed with status code ' + status));
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
    req.setTimeout(timeout, () => {
      req.destroy(new Error('Request timed out after ' + timeout + 'ms'));
    });

    if (method === 'POST' && body !== undefined) {
      req.write(body);
    }
    req.end();
  });
};

export default httpTransport;
