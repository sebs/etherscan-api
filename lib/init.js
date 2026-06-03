"use strict";
const httpGet = require('./http-get');
const log = require('./log');
const proxy = require('./proxy');
const stats = require('./stats');
const block = require('./block');
const transaction = require('./transaction');
const contract = require('./contract');
const account = require('./account');
const { resolveChainId } = require('./chains');
/**
 * @module etherscan/api
 */

// Etherscan V2: one host for every chain; the network is chosen with `chainid`.
const HOST = 'https://api.etherscan.io';

/**
 * @param {string} apiKey - (optional) Your Etherscan API key (works across all chains in V2)
 * @param {string|number} chain - (optional) Chain name (e.g. 'sepolia', 'arbitrum') or numeric chainid; defaults to Ethereum mainnet
 * @param {number} timeout - (optional) Timeout in milliseconds for requests, default 10000
 * @param {function} request - (optional) Custom HTTP transport `(url, { timeout }) => Promise<object>`; defaults to a built-in node:https GET
 * @returns {object} The namespaced API.
 */
module.exports = function(apiKey, chain, timeout, request) {

  if (!apiKey) {
    apiKey = 'YourApiKeyToken';
  }

  if (!timeout) {
    timeout = 10000;
  }

  const chainid = resolveChainId(chain);
  const doRequest = request || httpGet;

  // apikey + chainid are injected centrally so namespaces never repeat them.
  var getRequest = require('./get-request')(
    doRequest,
    { apikey: apiKey, chainid: chainid },
    { baseUrl: HOST, timeout: timeout }
  );

  /** @lends module:etherscan/api */
  return {
    /**
     * @namespace
     */
    log: log(getRequest),
    /**
     * @namespace
     */
    proxy: proxy(getRequest),
    /**
     * @namespace
     */
    stats: stats(getRequest),
    /**
     * @namespace
     */
    block: block(getRequest),
    /**
     * @namespace
     */
    transaction: transaction(getRequest),
    /**
     * @namespace
     */
    contract: contract(getRequest),
    /**
     * @namespace
     */
    account: account(getRequest)
  };
};
