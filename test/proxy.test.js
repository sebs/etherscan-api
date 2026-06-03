'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { mockApi, queryOf } = require('./helpers');

// Every proxy endpoint is JSON-RPC shaped: success replies carry no `status`
// field, just `{ jsonrpc, id, result }`, and the method resolves with the body.
const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };

describe('proxy namespace', function () {

  it('eth_blockNumber', async function () {
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_blockNumber();
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_blockNumber');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_getBlockByNumber (boolean defaults to true)', async function () {
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_getBlockByNumber('0x10d4f');
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_getBlockByNumber');
    assert.equal(q.get('tag'), '0x10d4f');
    assert.equal(q.get('boolean'), 'true');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_getBlockByNumber (boolean false when passed)', async function () {
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_getBlockByNumber('0x10d4f', false);
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_getBlockByNumber');
    assert.equal(q.get('tag'), '0x10d4f');
    assert.equal(q.get('boolean'), 'false');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_getUncleByBlockNumberAndIndex', async function () {
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_getUncleByBlockNumberAndIndex('0x210A9B', '0x0');
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_getUncleByBlockNumberAndIndex');
    assert.equal(q.get('tag'), '0x210A9B');
    assert.equal(q.get('index'), '0x0');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_getBlockTransactionCountByNumber', async function () {
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_getBlockTransactionCountByNumber('0x10FB78');
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_getBlockTransactionCountByNumber');
    assert.equal(q.get('tag'), '0x10FB78');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_getTransactionByHash', async function () {
    const txhash = '0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1';
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_getTransactionByHash(txhash);
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_getTransactionByHash');
    assert.equal(q.get('txhash'), txhash);
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_getTransactionByBlockNumberAndIndex', async function () {
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_getTransactionByBlockNumberAndIndex('0x10d4f', '0x0');
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_getTransactionByBlockNumberAndIndex');
    assert.equal(q.get('tag'), '0x10d4f');
    assert.equal(q.get('index'), '0x0');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_getTransactionCount', async function () {
    const address = '0x2910543af39aba0cd09dbb2d50200b3e800a63d2';
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_getTransactionCount(address);
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_getTransactionCount');
    assert.equal(q.get('address'), address);
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_sendRawTransaction', async function () {
    const hex = '0xf904808000831cfde080';
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_sendRawTransaction(hex);
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_sendRawTransaction');
    assert.equal(q.get('hex'), hex);
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_getTransactionReceipt', async function () {
    const txhash = '0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1';
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_getTransactionReceipt(txhash);
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_getTransactionReceipt');
    assert.equal(q.get('txhash'), txhash);
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_call', async function () {
    const to = '0xAEEF46DB4855E25702F8237E8f403FddcaF931C0';
    const data = '0x70a08231000000000000000000000000e16359506c028e51f16be38986ec5746251e9724';
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_call(to, data, 'latest');
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_call');
    assert.equal(q.get('to'), to);
    assert.equal(q.get('data'), data);
    assert.equal(q.get('tag'), 'latest');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_getCode', async function () {
    const address = '0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c';
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_getCode(address, 'latest');
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_getCode');
    assert.equal(q.get('address'), address);
    assert.equal(q.get('tag'), 'latest');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_getStorageAt', async function () {
    const address = '0x6e03d9cce9d60f3e9f2597e13cd4c54c55330cfd';
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_getStorageAt(address, '0x0', 'latest');
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_getStorageAt');
    assert.equal(q.get('address'), address);
    assert.equal(q.get('position'), '0x0');
    assert.equal(q.get('tag'), 'latest');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_gasPrice', async function () {
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_gasPrice();
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_gasPrice');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('eth_estimateGas', async function () {
    const to = '0xf0160428a8552ac9bb7e050d90eeade4ddd52843';
    const { api, transport } = mockApi(RPC_OK);

    const res = await api.proxy.eth_estimateGas(to, '0xff22', '0x051da038cc', '0xffffff');
    assert.equal(res.result, '0x1');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'proxy');
    assert.equal(q.get('action'), 'eth_estimateGas');
    assert.equal(q.get('to'), to);
    assert.equal(q.get('value'), '0xff22');
    assert.equal(q.get('gasPrice'), '0x051da038cc');
    assert.equal(q.get('gas'), '0xffffff');
    assert.equal(q.get('apikey'), 'KEY');
  });
});
