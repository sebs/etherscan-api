import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };
const TO = '0xf0160428a8552ac9bb7e050d90eeade4ddd52843';

describe('proxy.eth_estimateGas', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi(RPC_OK);
    transport = mocked.transport;
    const res = await mocked.api.proxy.eth_estimateGas(TO, '0xff22', '0x051da038cc', '0xffffff');
    result = res.result;
  });

  it('resolves with the RPC result', function () {
    assert.equal(result, '0x1');
  });

  it('targets the proxy module', function () {
    assert.equal(queryOf(transport).get('module'), 'proxy');
  });

  it('uses the eth_estimateGas action', function () {
    assert.equal(queryOf(transport).get('action'), 'eth_estimateGas');
  });

  it('sends the requested to address', function () {
    assert.equal(queryOf(transport).get('to'), TO);
  });

  it('sends the requested value', function () {
    assert.equal(queryOf(transport).get('value'), '0xff22');
  });

  it('sends the requested gasPrice', function () {
    assert.equal(queryOf(transport).get('gasPrice'), '0x051da038cc');
  });

  it('sends the requested gas', function () {
    assert.equal(queryOf(transport).get('gas'), '0xffffff');
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
