'use strict';
const https = require('node:https');
const http = require('node:http');

/**
 * Default HTTP transport: performs a GET and resolves the parsed JSON body.
 * Uses only Node built-ins (no third-party HTTP client). Callers can supply
 * their own transport with the same signature as the 4th argument to init().
 *
 * @param {string} url - Fully-qualified request URL (including query string).
 * @param {object} [options]
 * @param {number} [options.timeout=10000] - Request timeout in milliseconds.
 * @returns {Promise<object>} The parsed JSON response body.
 */
function httpGet(url, options) {
  const timeout = (options && options.timeout) || 10000;

  return new Promise(function (resolve, reject) {
    const transport = url.indexOf('http://') === 0 ? http : https;

    const req = transport.get(url, function (res) {
      const status = res.statusCode || 0;
      let body = '';

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        if (status < 200 || status >= 300) {
          return reject(new Error('Request failed with status code ' + status));
        }
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(new Error('Failed to parse response body: ' + err.message));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(timeout, function () {
      req.destroy(new Error('Request timed out after ' + timeout + 'ms'));
    });
  });
}

module.exports = httpGet;
