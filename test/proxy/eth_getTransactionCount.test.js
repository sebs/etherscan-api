import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };
const ADDRESS = '0x2910543af39aba0cd09dbb2d50200b3e800a63d2';

describe('proxy.eth_getTransactionCount', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi(RPC_OK);
    transport = mocked.transport;
    const res = await mocked.api.proxy.eth_getTransactionCount(ADDRESS);
    result = res.result;
  });

  it('resolves with the RPC result', function () {
    assert.equal(result, '0x1');
  });

  it('targets the proxy module', function () {
    assert.equal(queryOf(transport).get('module'), 'proxy');
  });

  it('uses the eth_getTransactionCount action', function () {
    assert.equal(queryOf(transport).get('action'), 'eth_getTransactionCount');
  });

  it('sends the requested address', function () {
    assert.equal(queryOf(transport).get('address'), ADDRESS);
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
