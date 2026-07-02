import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };
const TXHASH = '0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1';

describe('proxy.eth_getTransactionByHash', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi(RPC_OK);
    transport = mocked.transport;
    const res = await mocked.api.proxy.eth_getTransactionByHash(TXHASH);
    result = res.result;
  });

  it('resolves with the RPC result', function () {
    assert.equal(result, '0x1');
  });

  it('targets the proxy module', function () {
    assert.equal(queryOf(transport).get('module'), 'proxy');
  });

  it('uses the eth_getTransactionByHash action', function () {
    assert.equal(queryOf(transport).get('action'), 'eth_getTransactionByHash');
  });

  it('sends the requested txhash', function () {
    assert.equal(queryOf(transport).get('txhash'), TXHASH);
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
