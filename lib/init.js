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
      ethsupply() {
        const module = 'stats';
        const action = 'ethsupply';
        var query = querystring.stringify({
          module, action, apiKey
        });
        return getRequest(query);
      },
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
