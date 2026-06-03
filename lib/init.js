"use strict";
const axios = require('axios');
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
 * @param {object} client - (optional) axios client instance; if supplied its baseURL should be the Etherscan host
 * @returns {object} The namespaced API.
 */
module.exports = function(apiKey, chain, timeout, client = null) {

  if (!apiKey) {
    apiKey = 'YourApiKeyToken';
  }

  if (!timeout) {
    timeout = 10000;
  }

  const chainid = resolveChainId(chain);

  if (!client) {
    client = axios.create({
      baseURL: HOST,
      timeout: timeout
    });
  }

  // apikey + chainid are injected centrally so namespaces never repeat them.
  var getRequest = require('./get-request')(client, { apikey: apiKey, chainid: chainid });

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
