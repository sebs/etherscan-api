'use strict';
const assert = require('chai').assert;
const init = require('../.').init;
describe('api', function() {
  describe('account', function() {
    it('txlistinternal', function(done){
      this.timeout(5000);
      var api = init('YourApiKeyToken','testnet');
      var txlist = api.account.txlistinternal('0x7e61933A749ee94e900D46Ca6f31810811e01524');
      txlist.then(function(res){
        assert.ok(res);
        done();
      });
    });
  });
});
