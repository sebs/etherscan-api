'use strict';
const assert = require('chai').assert;
const init = require('../.').init;
describe('proxy', function() {
  it('eth.getminedblocks', function(done){
    var api = init();
    var txlist = api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b');
    txlist.then(function(res){
      assert.ok(res);
      done();
    });
  });
});
