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
      const queryObject = {
        module, action, address, blockno, apiKey
      };
      var query = new URLSearchParams(queryObject).toString();
      return getRequest(query);
    }
  };
};
