const querystring = require('querystring');
module.exports =function(getRequest, apiKey) {
  return {
    /**
     * Returns the number of most recent block
     * @example
     * var block = api.proxy.eth_blockNumber();
     * @returns {Promise.<integer>}
     */
    eth_blockNumber() {
      const module = 'proxy';
      const action = 'eth_blockNumber';
      var query = querystring.stringify({
        module, action, apiKey
      });
      return getRequest(query);
    },
    /**
     * Returns information about a block by block number.
     * @param {string} tag - Tag to look up
     * @example
     * var blockNumber = api.proxy.eth_getBlockByNumber('0x10d4f');
     * @returns {Promise.<integer>}
     */
    eth_getBlockByNumber(tag) {
      const module = 'proxy';
      const action = 'eth_getBlockByNumber';
      const boolean = true;
      var query = querystring.stringify({
        module, action, tag, apiKey, boolean
      });
      return getRequest(query);
    },
    /**
     * Returns information about a uncle by block number.
     * @param {string} tag - Tag to look up
     * @param {string} index - Index
     * @example
     * var res = api.proxy.eth_getUncleByBlockNumberAndIndex('0x210A9B', '0x0');
     * @returns {Promise.<object>}
     */
    eth_getUncleByBlockNumberAndIndex(tag, index) {
      const module = 'proxy';
      const action = 'eth_getUncleByBlockNumberAndIndex';
      var query = querystring.stringify({
        module, action, apiKey, tag, index
      });
      return getRequest(query);
    },
    /**
     * Returns the number of transactions in a block from a block matching the given block number
     * @param {string} tag - Tag to look up
     * @example
     * var res = api.proxy.eth_getBlockTransactionCountByNumber('0x10FB78');
     * @returns {Promise.<object>}
     */
    eth_getBlockTransactionCountByNumber(tag) {
      const module = 'proxy';
      const action = 'eth_getBlockTransactionCountByNumber';
      var query = querystring.stringify({
        module, action, apiKey, tag
      });
      return getRequest(query);
    },
    /**
     * Returns the information about a transaction requested by transaction hash
     * @param {string} hash - Transaction hash
     * @example
     * var res = api.proxy.eth_getTransactionByHash('0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1');
     * @returns {Promise.<object>}
     */
    eth_getTransactionByHash(txhash) {
      const module = 'proxy';
      const action = 'eth_getTransactionByHash';
      var query = querystring.stringify({
        module, action, apiKey, txhash
      });
      return getRequest(query);
    },
    /**
     * Returns information about a transaction by block number and transaction index position
     * @param {string} tag - Tag to look up
     * @param {string} index - Index
     * @example
     * var res = api.proxy.eth_getTransactionByBlockNumberAndIndex('0x10d4f', '0x0');
     * @returns {Promise.<object>}
     */
    eth_getTransactionByBlockNumberAndIndex(tag, index) {
      const module = 'proxy';
      const action = 'eth_getTransactionByBlockNumberAndIndex';
      var query = querystring.stringify({
        module, action, apiKey, tag, index
      });
      return getRequest(query);
    },
    /**
     * Returns the number of transactions sent from an address
     * @param {string} address - Address of the transaction
     * @example
     * var res = api.proxy.eth_getTransactionCount('0x2910543af39aba0cd09dbb2d50200b3e800a63d2', 'latest');
     * @returns {Promise.<object>}
     */
    eth_getTransactionCount(address) {
      const module = 'proxy';
      const action = 'eth_getTransactionCount';
      var query = querystring.stringify({
        module, action, apiKey, address
      });
      return getRequest(query);
    },
    /**
     * Creates new message call transaction or a contract creation for signed transactions
     * @param {string} hex - Serialized Message
     * @example
     * var res = api.proxy.eth_sendRawTransaction('0xf904808000831cfde080');
     * @returns {Promise.<object>}
     */
    eth_sendRawTransaction(hex) {
      const module = 'proxy';
      const action = 'eth_sendRawTransaction';
      var query = querystring.stringify({
        module, action, apiKey, hex
      });
      return getRequest(query);
    },
    /**
     * Returns the receipt of a transaction by transaction hash
     * @param {string} txhash - Transaction hash
     * @example
     * var ret = api.proxy.eth_getTransactionReceipt('0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1');
     * @returns {Promise.<object>}
     */
    eth_getTransactionReceipt(txhash) {
      const module = 'proxy';
      const action = 'eth_getTransactionReceipt';
      var query = querystring.stringify({
        module, action, apiKey, txhash
      });
      return getRequest(query);
    },
    /**
     * Executes a new message call immediately without creating a transaction on the block chain
     * @param {string} to - Address to execute from
     * @param {string} data - Data to transfer
     * @param {string} tag - A tag
     * @example
     * var res = api.proxy.eth_call('0xAEEF46DB4855E25702F8237E8f403FddcaF931C0', '0x70a08231000000000000000000000000e16359506c028e51f16be38986ec5746251e9724', 'latest');
     * @returns {Promise.<object>}
     */
    eth_call(to, data, tag) {
      const module = 'proxy';
      const action = 'eth_call';
      var query = querystring.stringify({
        module, action, apiKey, to, data, tag
      });
      return getRequest(query);
    },
    /**
     * Returns code at a given address
     * @param {string} address - Address to get code from
     * @param {string} tag - ??
     * @example
     * var res = api.proxy.eth_getCode('0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c',  'latest');
     * @returns {Promise.<object>}
     */
    eth_getCode(address, tag) {
      const module = 'proxy';
      const action = 'eth_getCode';
      var query = querystring.stringify({
        module, action, apiKey, address, tag
      });
      return getRequest(query);
    },
    /**
     * Returns the value from a storage position at a given address.
     * @param {string} address - Address to get code from
     * @param {string} position - Storage position
     * @param {string} tag - ??
     * @example
     * var res = api.proxy.eth_getStorageAt('0x6e03d9cce9d60f3e9f2597e13cd4c54c55330cfd', '0x0',  'latest');
     * @returns {Promise.<object>}
     */
    eth_getStorageAt(address, position, tag) {
      const module = 'proxy';
      const action = 'eth_getStorageAt';
      var query = querystring.stringify({
        module, action, apiKey, address, position, tag
      });
      return getRequest(query);
    },
    /**
     * Returns the current price per gas in wei.
     * var gasprice = api.proxy.eth_gasPrice();
     * @returns {Promise.<object>}
     */
    eth_gasPrice() {
      const module = 'proxy';
      const action = 'eth_gasPrice';
      var query = querystring.stringify({
        module, action, apiKey
      });
      return getRequest(query);
    },
    /**
     * Makes a call or transaction, which won't be added to the blockchain and returns the used gas, which can be used for estimating the used gas
     * @param {string} to - Address to get code from
     * @param {string} value - Storage position
     * @param {string} gasPrice - ??
     * @param {string} gas - ??
     * @xample
     * var res = api.proxy.eth_estimateGas(
     *  '0xf0160428a8552ac9bb7e050d90eeade4ddd52843',
     *  '0xff22',
     *  '0x051da038cc',
     *  '0xffffff'
     *);
     * @returns {Promise.<object>}
     */
    eth_estimateGas(to, value, gasPrice, gas) {
      const module = 'proxy';
      const action = 'eth_estimateGas';
      var query = querystring.stringify({
        module, action, apiKey, to, value, gasPrice, gas
      });
      return getRequest(query);
    },
  };
};
