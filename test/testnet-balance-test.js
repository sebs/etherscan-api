'use strict';
const assert = require('chai').assert;
const init = require('../.').init;
describe('testnet balance', function() {
  it('returns a promise', function( ){
    var api = init('YourApiKeyToken','ropsten');
    var balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
    assert.ok(balance.then);
  });

  it('executes the promise', function(done){
    var api = init('YourApiKeyToken','ropsten');
    var balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
    balance.then(function(){
      done();
    });
  });

  it('has data', function(done){
    var api = init('YourApiKeyToken','ropsten');
    var balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
    balance.then(function(res){
      assert.ok(res);
      done();
    });
  });

});
