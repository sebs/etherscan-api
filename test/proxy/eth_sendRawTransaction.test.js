import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };
const HEX = '0xf904808000831cfde080';

describe('proxy.eth_sendRawTransaction', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi(RPC_OK);
    transport = mocked.transport;
    const res = await mocked.api.proxy.eth_sendRawTransaction(HEX);
    result = res.result;
  });

  it('resolves with the RPC result', function () {
    assert.equal(result, '0x1');
  });

  it('targets the proxy module', function () {
    assert.equal(queryOf(transport).get('module'), 'proxy');
  });

  it('uses the eth_sendRawTransaction action', function () {
    assert.equal(queryOf(transport).get('action'), 'eth_sendRawTransaction');
  });

  it('sends the requested hex', function () {
    assert.equal(queryOf(transport).get('hex'), HEX);
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
