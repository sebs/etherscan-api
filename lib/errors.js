'use strict';

/**
 * Error thrown when the Etherscan API returns a logical failure
 * (status "0", a NOTOK message, or a JSON-RPC error object).
 *
 * @property {*} result - The raw `result` (or `error`) field from the API response, if any.
 * @property {*} status - The raw `status` field from the API response, if any.
 */
class EtherscanError extends Error {
  constructor(message, { result, status } = {}) {
    super(message);
    this.name = 'EtherscanError';
    this.result = result;
    this.status = status;
  }
}

module.exports = { EtherscanError };
