module.exports = function(getRequest) {
  return {
    /**
     * returns the status of a specific transaction hash
     * @param {string} txhash - Transaction hash
     * @returns {Promise.<object>}
     */
    getstatus(txhash) {
      const module = 'transaction';
      const action = 'getstatus';
      return getRequest({ module, action, txhash });
    }
  };
};
