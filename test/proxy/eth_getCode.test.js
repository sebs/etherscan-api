import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };
const ADDRESS = '0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c';

describe('proxy.eth_getCode', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi(RPC_OK);
    transport = mocked.transport;
    const res = await mocked.api.proxy.eth_getCode(ADDRESS, 'latest');
    result = res.result;
  });

  it('resolves with the RPC result', function () {
    assert.equal(result, '0x1');
  });

  it('targets the proxy module', function () {
    assert.equal(queryOf(transport).get('module'), 'proxy');
  });

  it('uses the eth_getCode action', function () {
    assert.equal(queryOf(transport).get('action'), 'eth_getCode');
  });

  it('sends the requested address', function () {
    assert.equal(queryOf(transport).get('address'), ADDRESS);
  });

  it('sends the requested tag', function () {
    assert.equal(queryOf(transport).get('tag'), 'latest');
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
