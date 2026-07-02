import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };
const TAG = '0x10FB78';

describe('proxy.eth_getBlockTransactionCountByNumber', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi(RPC_OK);
    transport = mocked.transport;
    const res = await mocked.api.proxy.eth_getBlockTransactionCountByNumber(TAG);
    result = res.result;
  });

  it('resolves with the RPC result', function () {
    assert.equal(result, '0x1');
  });

  it('targets the proxy module', function () {
    assert.equal(queryOf(transport).get('module'), 'proxy');
  });

  it('uses the eth_getBlockTransactionCountByNumber action', function () {
    assert.equal(queryOf(transport).get('action'), 'eth_getBlockTransactionCountByNumber');
  });

  it('sends the requested tag', function () {
    assert.equal(queryOf(transport).get('tag'), TAG);
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
