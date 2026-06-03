'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const nock = require('nock');
const { init } = require('..');
const { installNock } = require('./helpers');

installNock();

const HOST = 'https://api.etherscan.io';
const KEY = 'KEY';

// Every proxy endpoint is JSON-RPC shaped: success replies carry no `status`
// field, just `{ jsonrpc, id, result }`, and the method resolves with the body.
const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };

describe('proxy namespace', function () {

  function api() {
    return init(KEY);
  }

  it('eth_blockNumber', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_blockNumber' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_blockNumber().then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_getBlockByNumber (boolean defaults to true)', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_getBlockByNumber' &&
        q.tag === '0x10d4f' &&
        q.boolean === 'true' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_getBlockByNumber('0x10d4f').then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_getBlockByNumber (boolean false when passed)', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_getBlockByNumber' &&
        q.tag === '0x10d4f' &&
        q.boolean === 'false' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_getBlockByNumber('0x10d4f', false).then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_getUncleByBlockNumberAndIndex', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_getUncleByBlockNumberAndIndex' &&
        q.tag === '0x210A9B' &&
        q.index === '0x0' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_getUncleByBlockNumberAndIndex('0x210A9B', '0x0').then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_getBlockTransactionCountByNumber', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_getBlockTransactionCountByNumber' &&
        q.tag === '0x10FB78' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_getBlockTransactionCountByNumber('0x10FB78').then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_getTransactionByHash', function () {
    const txhash = '0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1';
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_getTransactionByHash' &&
        q.txhash === txhash &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_getTransactionByHash(txhash).then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_getTransactionByBlockNumberAndIndex', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_getTransactionByBlockNumberAndIndex' &&
        q.tag === '0x10d4f' &&
        q.index === '0x0' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_getTransactionByBlockNumberAndIndex('0x10d4f', '0x0').then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_getTransactionCount', function () {
    const address = '0x2910543af39aba0cd09dbb2d50200b3e800a63d2';
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_getTransactionCount' &&
        q.address === address &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_getTransactionCount(address).then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_sendRawTransaction', function () {
    const hex = '0xf904808000831cfde080';
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_sendRawTransaction' &&
        q.hex === hex &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_sendRawTransaction(hex).then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_getTransactionReceipt', function () {
    const txhash = '0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1';
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_getTransactionReceipt' &&
        q.txhash === txhash &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_getTransactionReceipt(txhash).then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_call', function () {
    const to = '0xAEEF46DB4855E25702F8237E8f403FddcaF931C0';
    const data = '0x70a08231000000000000000000000000e16359506c028e51f16be38986ec5746251e9724';
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_call' &&
        q.to === to &&
        q.data === data &&
        q.tag === 'latest' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_call(to, data, 'latest').then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_getCode', function () {
    const address = '0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c';
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_getCode' &&
        q.address === address &&
        q.tag === 'latest' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_getCode(address, 'latest').then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_getStorageAt', function () {
    const address = '0x6e03d9cce9d60f3e9f2597e13cd4c54c55330cfd';
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_getStorageAt' &&
        q.address === address &&
        q.position === '0x0' &&
        q.tag === 'latest' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_getStorageAt(address, '0x0', 'latest').then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_gasPrice', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_gasPrice' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_gasPrice().then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });

  it('eth_estimateGas', function () {
    const to = '0xf0160428a8552ac9bb7e050d90eeade4ddd52843';
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'proxy' &&
        q.action === 'eth_estimateGas' &&
        q.to === to &&
        q.value === '0xff22' &&
        q.gasPrice === '0x051da038cc' &&
        q.gas === '0xffffff' &&
        q.apikey === KEY)
      .reply(200, RPC_OK);

    return api().proxy.eth_estimateGas(to, '0xff22', '0x051da038cc', '0xffffff').then(res => {
      assert.equal(res.result, '0x1');
      scope.done();
    });
  });
});
