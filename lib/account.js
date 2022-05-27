const querystring = require('querystring');
module.exports = function(getRequest, apiKey) {
  return {
    /**
     * Returns the amount of Tokens a specific account owns.
     * @param {string} address - Contract address
     * @param {string} tokenname - Name of the token
     * @param {string} contractaddress - Contract address
     * @example
     *     var supply = api.account.tokenbalance(
     *       '0x4366ddc115d8cf213c564da36e64c8ebaa30cdbd',
     *       '',
     *       '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a' // DGD contract address
     * );
     * @returns {Promise.<object>}
     */
    tokenbalance(address, tokenname, contractaddress) {

      const module = 'account';
      const action = 'tokenbalance';
      const tag = 'latest';

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

      if (typeof address !== 'string' && address && address.length) {
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

      var queryObject = {
        module,
        action,
        apiKey
      };

      if (!sort) {
        sort = 'asc';
      }
      queryObject.sort = sort;

      if (txhash) {
        queryObject.txhash = txhash;
      } else {
        queryObject.address = address;

        if (!startblock) {
          startblock = 0;
        }
        queryObject.startblock = startblock;

        if (!endblock) {
          endblock = 'latest';
        }
        queryObject.endblock = endblock;
      }

      queryObject.txhash = txhash;

      return getRequest(querystring.stringify(queryObject));
    },
    /**
     * Get a list of transactions for a specfic address
     * @param {string} address - Transaction address
     * @param {string} startblock - start looking here
     * @param {string} endblock - end looking there
     * @param {number} page - Page number
     * @param {number} offset - Max records to return
     * @param {string} sort - Sort asc/desc
     * @example
     * var txlist = api.account.txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', 1, 'latest', 1, 100, 'asc');
     * @returns {Promise.<object>}
     */
    txlist(address, startblock, endblock, page, offset, sort) {
      const module = 'account';
      const action = 'txlist';

      if (!startblock) {
        startblock = 0;
      }

      if (!endblock) {
        endblock = 'latest';
      }

      if (!page) {
        page = 1;
      }

      if (!offset) {
        offset = 100;
      }

      if (!sort) {
        sort = 'asc';
      }

      var query = querystring.stringify({
        module, action, startblock, endblock, page, offset, sort, address, apiKey
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
    },
     /**
     * [BETA] Get a list of "ERC20 - Token Transfer Events" by Address
     * @param {string} address - Account address
     * @param {string} startblock - start looking here
     * @param {string} endblock - end looking there
      * @param {number} page - Page number
      * @param {number} offset - Max records to return
      * @param {string} sort - Sort asc/desc
     * @param {string} contractaddress - Address of ERC20 token contract (if not specified lists transfers for all tokens)
     * @example
     * var txlist = api.account.tokentx('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da', 1, 'latest', 'asc');
     * @returns {Promise.<object>}
     */
    tokentx(address, contractaddress, startblock, endblock, page, offset, sort) {
      const module = 'account';
      const action = 'tokentx';

      if (!startblock) {
        startblock = 0;
      }

      if (!endblock) {
        endblock = 'latest';
      }

       if (!page) {
         page = 1;
       }

       if (!offset) {
         offset = 100;
       }

      if (!sort) {
        sort = 'asc';
      }

      var queryObject = {
        module, action, startblock, endblock, page, offset, sort, address, apiKey
      };

      if (contractaddress) {
        queryObject.contractaddress = contractaddress;
      }

      return getRequest(querystring.stringify(queryObject));
    },

    /**
    * [BETA] Get a list of "ERC721 - Token Transfer Events" by Address
    * @param {string} address - Account address
    * @param {string} startblock - start looking here
    * @param {string} endblock - end looking there
     * @param {number} page - Page number
     * @param {number} offset - Max records to return
     * @param {string} sort - Sort asc/desc
    * @param {string} contractaddress - Address of ERC721 token contract (if not specified lists transfers for all tokens)
    * @example
    * var txlist = api.account.tokenftntx('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da', 1, 'latest', 'asc');
    * @returns {Promise.<object>}
    */
   tokennfttx(address, contractaddress, startblock, endblock, page, offset, sort) {
     const module = 'account';
     const action = 'tokennfttx';

     if (!startblock) {
       startblock = 0;
     }

     if (!endblock) {
       endblock = 'latest';
     }

      if (!page) {
        page = 1;
      }

      if (!offset) {
        offset = 100;
      }

     if (!sort) {
       sort = 'asc';
     }

     var queryObject = {
       module, action, startblock, endblock, page, offset, sort, address, apiKey
     };

     if (contractaddress) {
       queryObject.contractaddress = contractaddress;
     }

     return getRequest(querystring.stringify(queryObject));
   }
  };
};
