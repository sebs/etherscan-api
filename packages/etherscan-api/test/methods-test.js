'use strict';
const assert = require('chai').assert;
const init = require('../.').init;
describe('methods', function() {

  it('accounts.txlist', function(done){
    var api = init();
    var txlist = api.accounts.txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
    txlist.then(function(res){
      assert.ok(res);
      done();
    });
  });

  it('accounts.txlistinternal', function(done){
    var api = init();
    var txlist = api.accounts.txlistinternal('0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170');
    txlist.then(function(res){
      assert.ok(res);
      done();
    });
  });

  it('accounts.balance', function(done){
    var api = init();
    var balance = api.accounts.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
    balance.then(function(res){
      assert.ok(res);
      done();
    });
  });


  it('accounts.balance multi', function(done){
    var api = init();
    var balance = api.accounts.balance(['0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae']);
    balance.then(function(res){
      assert.ok(res);
      done();
    });
  });

  it('ethsuppyl', function(done){
    var api = init();
    var supply = api.ethsupply();
    supply.then(function(res){
      assert.ok(res);
      done();
    });
  });

  it('ethprice', function(done){
    var api = init();
    var price = api.ethprice();
    price.then(function(res){
      assert.ok(res);
      done();
    });
  });

  it('getblockreward', function(done){
    var api = init();
    var blockreward = api.getblockreward();
    blockreward.then(function(res){
      assert.ok(res);
      done();
    });
  });

  it('getstatus', function(done){
    var api = init();
    var status = api.getstatus('0x15f8e5ea1079d9a0bb04a4c58ae5fe7654b5b2b4463375ff7ffb490aa0032f3a');
    status.then(function(res){
      assert.ok(res);
      done();
    });
  });

  it('getabi', function(done){
    var api = init();
    var abi = api.getabi('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413');
    abi.then(function(res){
      assert.ok(res);
      done();
    });
  });
});
