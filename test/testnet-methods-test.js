'use strict';
const assert = require('chai').assert;
const init = require('../.').init;
describe('testnet methods', function () {

  describe('account', function () {
    var api;

    beforeEach(function () {
      api = init('YourApiKeyToken', 'ropsten');
    });

    xit('getminedblocks', function (done) {
      var txlist = api.account.getminedblocks('0x3D6F8823Ad21CD299814B62D198d9001E67E20B3');
      txlist
        .then(function (res) {
          assert.ok(res);
          done();
        })
        .catch(done);
    });
    /**
     * @deprecated by Etherscan
     * https://etherscan.io/apis#tokens
     */
    // it('tokenbalance by name', function (done) {
    //   var supply = api.account.tokenbalance(
    //     '0x0a869d79a7052c7f1b55a8ebabbea3420f0d1e13',
    //     'TheDAO'
    //   );
    //
    //   supply.then(function (res) {
    //     assert.ok(res);
    //     done();
    //   });
    // });

    it('tokenbalance by address', function (done) {
      var supply = api.account.tokenbalance(
        '0xe04f27eb70e025b78871a2ad7eabe85e61212761',
        false,
        '0x57d90b64a1a57749b0f932f1a3395792e12e7055'
      );
      supply.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('tokentx', function (done) {
      /**
       * No transaction found in testnet
       * var txlist = api.account.txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
       */
      var txlist = api.account.tokentx(
        '0x293bae8584ed8df4a0319d95ffef5fb3645a22b6',
        '0x4fa5333ecfe1afca2624e14b039268c4591ef8b9'
      );

      txlist.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    xit('txlist', function (done) {
      /**
       * No transaction found in testnet
       * var txlist = api.account.txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
       */
      var txlist = api.account.txlist('0x3FAcfa472e86E3EDaEaa837f6BA038ac01F7F539');
      txlist.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    xit('txlistinternal by hash', function (done) {
      var txlist = api.account.txlistinternal('0xf2aa030a0b889706206d262377cd45489faa2ff7dedbccda3693bf6c5370ed0c');
      txlist.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });
    xit('txlistinternal by address', function (done) {

      var txlist = api.account.txlistinternal(null, '0x3FAcfa472e86E3EDaEaa837f6BA038ac01F7F539');
      txlist.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('balance', function (done) {

      var balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      balance.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });
    it('balance multi', function (done) {

      var balance = api.account.balance(['0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae']);
      balance.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });
  });
  describe('stats', function () {
    var api;

    beforeEach(function () {
      api = init('YourApiKeyToken', 'ropsten');
    });

    it('ethsupply', function (done) {

      var supply = api.stats.ethsupply();
      supply.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('tokensupply by tokenname', function (done) {

      var supply = api.stats.tokensupply('MKR');
      supply.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });
    it('tokensupply by address', function (done) {

      var supply = api.stats.tokensupply(null, '0x57d90b64a1a57749b0f932f1a3395792e12e7055');
      supply.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('ethprice', function (done) {

      var price = api.stats.ethprice();
      price.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });
  });


  it('block.getblockreward', function (done) {
    var api = init('YourApiKeyToken', 'ropsten');

    var blockreward = api.block.getblockreward();
    blockreward.then(function (res) {
      assert.ok(res);
      done();
    }).catch(done);
  });

  it('transaction.getstatus', function (done) {
    var api = init('YourApiKeyToken', 'ropsten');
    var status = api.transaction.getstatus('0x15f8e5ea1079d9a0bb04a4c58ae5fe7654b5b2b4463375ff7ffb490aa0032f3a');
    status.then(function (res) {
      assert.ok(res);
      done();
    }).catch(done);
  });

  xit('contract.getabi', function (done) {
    var api = init('YourApiKeyToken', 'ropsten');
    // Has no contract with this address
    //  var abi = api.contract.getabi('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413');
    var abi = api.contract.getabi('0xCe9bb652DD190454B91CEe1f7D5fE6Bac3Ca85Fc');
    abi.then(function (res) {
      assert.ok(res);
      done();
    }).catch(done);
  });


  describe('proxy', function () {
    var api;

    beforeEach(function () {
      api = init('YourApiKeyToken', 'ropsten');
    });

    it('proxy.eth_blockNumber', function (done) {

      var res = api.proxy.eth_blockNumber();
      res.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });


    it('proxy.eth_getBlockByNumber', function (done) {

      var res = api.proxy.eth_getBlockByNumber('0x10d4f');
      res.then(function (res) {
        assert.ok(res);
        done();
      });
    });


    it.skip('proxy.eth_getUncleByBlockNumberAndIndex', function (done) {

      var res = api.proxy.eth_getUncleByBlockNumberAndIndex('0x210A9B', '0x0');
      res.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('proxy.eth_getBlockTransactionCountByNumber', function (done) {

      var res = api.proxy.eth_getBlockTransactionCountByNumber('0x10FB78');
      res.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('proxy.eth_getTransactionByHash', function (done) {

      var res = api.proxy.eth_getTransactionByHash('0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1');
      res.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });


    it.skip('proxy.eth_getTransactionByBlockNumberAndIndex', function (done) {

      var res = api.proxy.eth_getTransactionByBlockNumberAndIndex('0x10d4f', '0x0');
      res.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('proxy.eth_getTransactionCount', function (done) {

      var res = api.proxy.eth_getTransactionCount('0x2910543af39aba0cd09dbb2d50200b3e800a63d2', 'latest');
      res.then(function (res) {
        assert.ok(res);
        done();
      });
    });

    xit('proxy.eth_sendRawTransaction', function (done) {

      var res = api.proxy.eth_sendRawTransaction('0xf904808000831cfde080');
      res.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('proxy.eth_getTransactionReceipt', function (done) {

      var res = api.proxy.eth_getTransactionReceipt('0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1');
      res.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('proxy.eth_call', function (done) {

      var res = api.proxy.eth_call(
        '0xAEEF46DB4855E25702F8237E8f403FddcaF931C0',
        '0x70a08231000000000000000000000000e16359506c028e51f16be38986ec5746251e9724',
        'latest'
      );
      res.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('proxy.eth_getCode', function (done) {

      var res = api.proxy.eth_getCode('0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c', 'latest');
      res.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    it('proxy.eth_getStorageAt', function (done) {

      var res = api.proxy.eth_getStorageAt('0x6e03d9cce9d60f3e9f2597e13cd4c54c55330cfd', '0x0', 'latest');
      res.then(function (res) {
        assert.ok(res);
        done();
      });
    });

    it('proxy.eth_gasPrice', function (done) {

      var res = api.proxy.eth_gasPrice();
      res.then(function (res) {
        assert.ok(res);
        done();
      }).catch(done);
    });

    /**
     * Hide it, because Etherscan returning an internal error
     */
    // xit('proxy.eth_estimateGas', function (done) {
    //   var res = api.proxy.eth_estimateGas(
    //     '0xf0160428a8552ac9bb7e050d90eeade4ddd52843',
    //     '0xff22',
    //     '0x051da038cc',
    //     '0xffffff'
    //   );

    //   res.then(function (res) {
    //     assert.ok(res);
    //     done();
    //   })
    // });
  });
});
