import https from 'node:https';
import http from 'node:http';
import type { IncomingMessage } from 'node:http';
import type { Transport } from './types.js';

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

  return new Promise((resolve, reject) => {
    const lib = url.indexOf('http://') === 0 ? http : https;

    const headers: Record<string, string | number> = {};
    if (method === 'POST' && body !== undefined) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = lib.request(url, { method, headers, timeout }, (res: IncomingMessage) => {
      const status = res.statusCode || 0;
      let data = '';

      res.setEncoding('utf8');
      res.on('data', (chunk: string) => {
        data += chunk;
      });
      res.on('end', () => {
        if (status < 200 || status >= 300) {
          reject(new Error('Request failed with status code ' + status));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('Failed to parse response body: ' + (err as Error).message));
        }
      });
    });

    req.on('error', reject);
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
