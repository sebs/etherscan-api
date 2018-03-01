'use strict';
const assert = require('chai').assert;
const init = require('../.').init;
describe('balance', function() {

  it('no param sends a error', function(done){
    var api = init();
    var balance = api.account.balance();
    balance.catch(function(err){
      assert.ok(err);
      done();
    });
  });
});
