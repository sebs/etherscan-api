"use strict";
var restify = require('restify-clients');
const querystring = require('querystring');

const url = 'https://api.etherscan.io';
const testUrls = {
  // old default defaults to rinkeb
  'ropsten': 'https://ropsten.etherscan.io',
  'kovan': 'https://kovan.etherscan.io',
  'rinkeby': 'https://rinkeby.etherscan.io'
};

/**
 * @module etherscan/api
 */

 // chain is for testnet (ropsten, rinkeby, kovan)
module.exports = function (apiKey, chain) {

  if (!apiKey) {
    apiKey = 'YourApiKeyToken';
  }

  function pickChainUrl(chain) {
    if (!chain) {
      return url;
    }

    if (!testUrls[chain]) {
      throw Error('Chain missing ' + chain);
    }

    return testUrls[chain];
  }

  var client = restify.createJsonClient({
    // added testnet condition
    url: pickChainUrl(chain),
  //  url: url,
    version: '*'
  });

  function getRequest(query) {
    var p = new Promise(function(resolve, reject) {
      client.get('/api?'+query, function(err, req, res, data) {
        if (err) {
          return reject(err);
        }
        // reject a error from the normal RPC
        if (data.status && data.status != 1) {
          return reject(data.message);
        }

        if (data.error) {
          return reject(data.error.message);
        }

        resolve(data);
      });
    });
    return p;
  }
  /** @lends module:etherscan/api */
  return {
    /**
    * @namespace
    */
    log: {
      /**
       * The Event Log API was designed to provide an alternative to the native eth_getLogs.
       */
      getLogs(
        address,
        fromBlock,
        toBlock,
        topic0,
        topic0_1_opr,
        topic1,
        topic1_2_opr,
        topic2,
        topic2_3_opr,
        topic3) {

        const module = 'logs';
        const action = 'getLogs';
        var params = {
          module, action, apiKey, address
        };

        if (address) {
          params.address = address;
        }

        if (fromBlock) {
          params.fromBlock = fromBlock;
        }

        if (toBlock) {
          params.toBlock = toBlock;
        }

        if (topic0) {
          params.topic0 = topic0;
        }

        if (topic0_1_opr) {
          params.topic0_1_opr = topic0_1_opr;
        }

        if (topic1) {
          params.topic1 = topic1;
        }

        if (topic1_2_opr) {
          params.topic1_2_opr = topic1_2_opr;
        }

        if (topic2) {
          params.topic2 = topic2;
        }

        if (topic2_3_opr) {
          params.topic2_3_opr = topic2_3_opr;
        }

        if (topic3) {
          params.topic3 = topic3;
        }
        var query = querystring.stringify(params);
        return getRequest(query);
      }
    },
    /**
    * @namespace
    */
    proxy: {
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
    },
    /**
    * @namespace
    */
    stats: {
      /**
       * Returns the supply of Tokens
       * @param {string} tokenname - Name of the Token
       * @param {string} contractaddress - Address from token contract
       * @example
       * var supply = api.stats.tokensupply(null, '0x57d90b64a1a57749b0f932f1a3395792e12e7055');
       * @returns {Promise.<object>}
       */
      tokensupply(tokenname, contractaddress) {
        const module = 'stats';
        const action = 'tokensupply';

        let params = {
          module, action, apiKey
        };

        if (tokenname) {
          params.tokenname = tokenname;
        }

        if (contractaddress) {
          params.contractaddress = contractaddress;
        }

        var query = querystring.stringify(params);
        return getRequest(query);
      },

      /**
       * Returns total supply of ether
       * var supply = api.stats.ethsupply();
       * @returns {Promise.<integer>}
       */
      ethsupply() {
        const module = 'stats';
        const action = 'ethsupply';
        var query = querystring.stringify({
          module, action, apiKey
        });
        return getRequest(query);
      },

      /**
       * Returns the price of ether now
       * @example
       * var price = api.stats.ethprice();
       * @returns {Promise.<integer>}
       */
      ethprice() {
        const module = 'stats';
        const action = 'ethprice';
        var query = querystring.stringify({
          module, action, apiKey
        });
        return getRequest(query);
      }
    },
    /**
    * @namespace
    */
    block: {
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
    },
    /**
    * @namespace
    */
    transaction: {
      /**
       * returns the status of a specific transaction hash
       * @param {string} txhash - Transaction hash
       * @returns {Promise.<object>}
       */
      getstatus(txhash) {
        const module = 'transaction';
        const action = 'getstatus';
        var query = querystring.stringify({
          module, action, txhash, apiKey
        });
        return getRequest(query);
      }
    },
    /**
    * @namespace
    */
    contract: {
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
    },
    /**
    * @namespace
    */
    account: {
      /**
       * Returns the amount of Tokens a specific account owns.
       * @param {string} address - Contract address
       * @param {string} tokenname - Name of the token
       * @param {string} contractaddress - Contract address
       * @example
       *     var supply = api.account.tokenbalance(
       *       '0x4366ddc115d8cf213c564da36e64c8ebaa30cdbd',
       *       'DGD',
       *       ''
       * );
       * @returns {Promise.<object>}
       */
      tokenbalance(address, tokenname, contractaddress){

        const module = 'account';
        const action = 'tokenbalance';
        const  tag = 'latest';

        var queryObject = {
          module, action, apiKey, tag
        };

        if (contractaddress) {
          queryObject.contractaddress = contractaddress;
        }

        if (tokenname) {
          queryObject.tokenname = tokenname;
        }

        if (address) {
          queryObject.address = address;
        }

        var query = querystring.stringify(queryObject);
        return getRequest(query);
      },
      /**
       * Returns the balance of a sepcific account
       * @param {string} address - Address
       * @example
       * var balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
       * @returns {Promise.<object>}
       */
      balance(address) {
        const module = 'account';
        let action = 'balance';
        const tag = 'latest';

        if (typeof address != 'string' && address.length) {
          address = address.join(',');
          action = 'balancemulti';
        }

        var query = querystring.stringify({
          module, action, tag, address, apiKey
        });
        return getRequest(query);
      },
      /**
       * Get a list of internal transactions
       * @param {string} txhash - Transaction hash. If specified then address will be ignored
       * @param {string} address - Transaction address
       * @param {string} startblock - start looking here
       * @param {string} endblock - end looking there
       * @param {string} sort - Sort asc/desc
       * @example
       * var txlist = api.account.txlistinternal('0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170');
       * @returns {Promise.<object>}
       */
      txlistinternal(txhash, address, startblock, endblock, sort) {
        const module = 'account';
        const action = 'txlistinternal';

        if (!startblock) {
          startblock = 0;
        }

        if (!endblock) {
          endblock = 'latest';
        }

        if (!sort) {
          sort = 'asc';
        }

        if (txhash) {
          address = undefined;
        }

        var query = querystring.stringify({
          module, action, txhash, address, apiKey
        });

        return getRequest(query);
      },
      /**
       * Get a list of transactions for a specfic address
       * @param {string} address - Transaction address
       * @param {string} startblock - start looking here
       * @param {string} endblock - end looking there
       * @param {string} sort - Sort asc/desc
       * @example
       * var txlist = api.account.txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', 1, 'latest', 'asc');
       * @returns {Promise.<object>}
       */
      txlist(address, startblock, endblock, sort) {
        const module = 'account';
        const action = 'txlist';

        if (!startblock) {
          startblock = 0;
        }

        if (!endblock) {
          endblock = 'latest';
        }

        if (!sort) {
          sort = 'asc';
        }

        var query = querystring.stringify({
          module, action, startblock, endblock, sort, address, apiKey
        });

        return getRequest(query);
      },
      /**
       * Get a list of blocks that a specific account has mineds
       * @example
       * var txlist = api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b');
       * @param {string} address - Transaction hash
       */
      getminedblocks(address) {
        const module = 'account';
        const action = 'getminedblocks';
        var query = querystring.stringify({
          module, action, address, apiKey
        });
        return getRequest(query);
      }
    }
  };
};
