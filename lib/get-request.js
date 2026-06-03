'use strict';
const { EtherscanError } = require('./errors');

/**
 * Builds the shared request function. Every namespace passes a plain params
 * object; this function injects the universal `apikey` and `chainid`, serialises
 * the query, hits the Etherscan V2 endpoint, and normalises the response.
 *
 * @param {object} client - An axios instance whose baseURL is the Etherscan host.
 * @param {object} defaults - Always-applied params, i.e. `{ apikey, chainid }`.
 * @returns {function(object): Promise<object>}
 */
module.exports = function (client, defaults) {

  /**
   * @param {object} params - module/action and endpoint-specific params.
   * @returns {Promise<object>} The raw API response body on success.
   */
  function getRequest(params) {
    const query = new URLSearchParams(Object.assign({}, params, defaults)).toString();

    return client.get('/v2/api?' + query).then(function (response) {
      const data = response.data;

      // Standard REST endpoints report failure with status "0".
      // (JSON-RPC proxy endpoints have no `status` field — skip them here.)
      if (data.status !== undefined && String(data.status) !== '1') {
        let message = 'NOTOK';
        if (typeof data.result === 'string' && data.result) {
          message = data.result;
        } else if (typeof data.message === 'string' && data.message) {
          message = data.message;
        }
        throw new EtherscanError(message, { result: data.result, status: data.status });
      }

      // JSON-RPC proxy endpoints report failure with an `error` object/string.
      if (data.error) {
        let message = data.error;
        if (typeof data.error === 'object' && data.error.message) {
          message = data.error.message;
        }
        throw new EtherscanError(message, { result: data.error });
      }

      return data;
    });
  }

  return getRequest;
};
