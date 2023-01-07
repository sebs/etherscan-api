module.exports = function(getRequest, apiKey) {
  return {
    /**
     * Returns the ABI/Interface of a given contract
     * @param {string} address - Contract address
     * @example
     * api.contract
     *  .getabi('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413')
     *  .then(console.log)
     * @returns {Promise.<object>}
     */
    getabi(address) {
      const module = 'contract';
      const action = 'getabi';

      const queryObject = {
        module, action, address, apiKey
      };
      var query = new URLSearchParams(queryObject).toString();
      return getRequest(query);
    },
    /**
     * Returns the Sourcecode of a given verified contract
     * @param {string} address - Contract address
     * @example
     * api.contract
     *  .getsourcecode('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413')
     *  .then(console.log)
     * @returns {Promise.<object>}
     */
    getsourcecode(address) {
      const module = 'contract';
      const action = 'getsourcecode';
      const queryObject = {
        module, action, address, apiKey
      };
      var query = new URLSearchParams(queryObject).toString();
      return getRequest(query);
    }
  };
};
