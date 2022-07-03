"use strict";
const axios = require('axios');
const log = require('./log');
const proxy = require('./proxy');
const stats = require('./stats');
const block = require('./block');
const transaction = require('./transaction');
const contract = require('./contract');
const account = require('./account');
const pickChainUrl = require('./pick-chain-url');
/**
 * @module etherscan/api
 */


/**
 * @param {string} apiKey - (optional) Your Etherscan APIkey
 * @param {string} chain - (optional) Other chain keys [ropsten, rinkeby, kovan]
 * @param {number} timeout - (optional) Timeout in milliseconds for requests, default 10000
 * @param {object} client - optional axios client instance
 */
module.exports = function(apiKey, chain, timeout, client = null) {

  if (!apiKey) {
    apiKey = 'YourApiKeyToken';
  }

  if (!timeout) {
    timeout = 10000;
  }

  if (!client) {
    client = axios.create({
      baseURL: pickChainUrl(chain),
      timeout: timeout
    });  
  } 
  
  var getRequest = require('./get-request')(chain, timeout, client);

  /** @lends module:etherscan/api */
  return {
    /**
     * @namespace
     */
    log: log(getRequest, apiKey),
    /**
     * @namespace
     */
    proxy: proxy(getRequest, apiKey),
    /**
     * @namespace
     */
    stats: stats(getRequest, apiKey),
    /**
     * @namespace
     */
    block: block(getRequest, apiKey),
    /**
     * @namespace
     */
    transaction: transaction(getRequest, apiKey),
    /**
     * @namespace
     */
    contract: contract(getRequest, apiKey),
    /**
     * @namespace
     */
    account: account(getRequest, apiKey)
  };
};
