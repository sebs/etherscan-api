'use strict';
const assert = require('chai').assert;
const init = require('../.').init;
describe('testnet eth', function() {
  xit('eth.getminedblocks', function(done){
    var api = init('YourApiKeyToken','morden');
    //In testnet there are no mined blocks by this account
    //reference - https://testnet.etherscan.io/api?module=account&action=getminedblocks&address=0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b&blocktype=blocks&apikey=YourApiKeyToken
    //  var txlist = api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b');
// will use other address instead
    var txlist = api.account.getminedblocks('0x3D6F8823Ad21CD299814B62D198d9001E67E20B3');
    txlist.then(function(res){
      assert.ok(res);
      done();
    });
  });
});
