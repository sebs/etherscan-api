'use strict';
const assert = require('chai').assert;
const axios = require('axios');
const {
  init,
  pickChainUrl
} = require('..');


describe('pass client', function() {

  it('executes successfully', function(done){

    const chain = pickChainUrl(null);
    const client = axios.create({
      baseURL: chain,
      timeout: 10000
    });  


    var api = init(process.env.API_KEY, null, 10000, client);
    var txlist = api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b');
    txlist.then(function(res){
      assert.ok(res);
      done();
    });
  });
});
