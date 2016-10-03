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
      client.get(url+query, function(err, req, res, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
    return p;
  }

  return {
    balance(address) {
      const module = 'account';
      const action = 'balance';
      const tag = 'latest';

      var query = querystring.stringify({
        module, action, tag, address, apiKey
      });
      return getRequest(query);
    }
  };
};
