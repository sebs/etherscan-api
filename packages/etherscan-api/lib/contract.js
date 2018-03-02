const querystring = require('querystring');
module.exports = function(getRequest, apiKey) {
  return {
    /**
     * Returns the ABI/Interface of a given contract
     * @param {string} address - Contract address
     * @example
     * api.contract
     *  .getabi('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359')
     *  .at('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359')
     *  .memberId('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359')
     *  .then(console.log)
     * @returns {Promise.<object>}
     */
    getabi(address) {
      const module = 'contract';
      const action = 'getabi';

      var query = querystring.stringify({
        module, action, address, apiKey
      });

      return getRequest(query);
    }
  };
};
