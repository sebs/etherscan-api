module.exports = function(getRequest, apiKey) {
  return {
    /**
     * returns the status of a specific transaction hash
     * @param {string} txhash - Transaction hash
     * @returns {Promise.<object>}
     */
    getstatus(txhash) {
      const module = 'transaction';
      const action = 'getstatus';
      const queryObject = {
        module, action, txhash, apiKey
      };
      var query = new URLSearchParams(queryObject).toString();
      return getRequest(query);
    }
  };
};
