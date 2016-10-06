var restify = require('restify');
const querystring = require('querystring');

const url = 'https://api.etherscan.io/api';

module.exports = function (apiKey) {

  if (!apiKey) {
    apiKey = 'YourApiKeyToken';
  }

  var client = restify.createJsonClient({
    url: url,
    version: '*'
  });

  function getRequest(query) {
    var p = new Promise(function(resolve, reject) {
      client.get(url+'?'+query, function(err, req, res, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
    return p;
  }

  return {
    stats: {
      /*
       * Returns the supply of Tokens
       */
      tokensupply(tokenname) {
        const module = 'stats';
        const action = 'tokensupply';
        var query = querystring.stringify({
          module, action, tokenname, apiKey
        });
        return getRequest(query);
      },
      /*
       * Returns total supply of ether
       */
      ethsupply() {
        const module = 'stats';
        const action = 'ethsupply';
        var query = querystring.stringify({
          module, action, apiKey
        });
        return getRequest(query);
      },

      /*
       * Returns tthe price of ether now
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
    block: {
      /*
       * Find the block reward for a given address and block
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
    transaction: {
      /*
       * returns the status of a specific transaction hash
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
    contract: {
      /*
       * Returns the ABI/Interface of a given contract
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
    account: {
      /*
       * Returns the supply of tokens, given a specific address of one token account
       */
      tokensupply(contractaddress) {
        const module = 'account';
        const action = 'tokensupply';
        var query = querystring.stringify({
          module, action, contractaddress, apiKey
        });
        return getRequest(query);
      },
      /*
       * Returns the amount of Tokens a specific account owns
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
        var query = querystring.stringify(queryObject);
        return getRequest(query);
      },
      /*
       * Returns the balance of a sepcific account
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
      /*
       * Get a list of internal transactions
       */
      txlistinternal(address, startblock, endblock, sort) {
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

        var query = querystring.stringify({
          module, action, startblock, endblock, sort, address, apiKey
        });

        return getRequest(query);
      },
      /*
       * Get a list of transactions for a specfic address
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
      /*
       * Get a list of blocks that a specific account has mineds
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
