import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };
const ADDRESS = '0x6e03d9cce9d60f3e9f2597e13cd4c54c55330cfd';

describe('proxy.eth_getStorageAt', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi(RPC_OK);
    transport = mocked.transport;
    const res = await mocked.api.proxy.eth_getStorageAt(ADDRESS, '0x0', 'latest');
    result = res.result;
  });

  it('resolves with the RPC result', function () {
    assert.equal(result, '0x1');
  });

  it('targets the proxy module', function () {
    assert.equal(queryOf(transport).get('module'), 'proxy');
  });

  it('uses the eth_getStorageAt action', function () {
    assert.equal(queryOf(transport).get('action'), 'eth_getStorageAt');
  });

  it('sends the requested address', function () {
    assert.equal(queryOf(transport).get('address'), ADDRESS);
  });

  it('sends the requested position', function () {
    assert.equal(queryOf(transport).get('position'), '0x0');
  });

  it('sends the requested tag', function () {
    assert.equal(queryOf(transport).get('tag'), 'latest');
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
