const querystring = require('querystring');
module.exports = function(getRequest, apiKey) {
  return {
    /**
     * Find the block reward for a given address and block
     * @param {string} address - Address of the block
     * @param {string} blockno - Block number
     * @returns {Promise.<object>}
     */
    getblockreward(address, blockno) {
      const module = 'block';
      const action = 'getblockreward';
      if (!blockno) {
        blockno = 0;
      }
      var query = querystring.stringify({
        module, action, address, blockno, apiKey
      });
      return getRequest(query);
    }
  };
};
