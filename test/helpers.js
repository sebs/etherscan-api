import { mock } from 'node:test';
import { init } from '../lib/index.js';

// Unit tests mock at the transport seam (the 4th arg to init) using node:test's
// built-in mock.fn() — no HTTP interception, no third-party mocking library, and
// nothing ever touches the network. The real node:https transport is exercised
// separately in http-get.test.js against a local server.

/**
 * Build an api whose HTTP transport is a node:test mock.
 * @param {object|function} response - The body the transport resolves with, or
 *   a custom transport implementation `(url, opts) => Promise`.
 * @param {object} [opts] - { apiKey, chain, timeout }
 * @returns {{ api: object, transport: import('node:test').Mock }}
 */
export function mockApi(response, opts) {
  opts = opts || {};
  const impl = typeof response === 'function'
    ? response
    : function () { return Promise.resolve(response); };

  const transport = mock.fn(impl);
  const api = init(opts.apiKey || 'KEY', opts.chain, opts.timeout || 10000, transport);
  return { api, transport };
}

/**
 * The URLSearchParams of the transport's Nth call (default: first).
 * Use `.get('name')` to read a param (returns null when absent).
 */
export function queryOf(transport, callIndex) {
  const call = transport.mock.calls[callIndex || 0];
  return new URL(call.arguments[0]).searchParams;
}
