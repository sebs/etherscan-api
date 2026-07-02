import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };
const TO = '0xAEEF46DB4855E25702F8237E8f403FddcaF931C0';
const DATA = '0x70a08231000000000000000000000000e16359506c028e51f16be38986ec5746251e9724';

describe('proxy.eth_call', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi(RPC_OK);
    transport = mocked.transport;
    const res = await mocked.api.proxy.eth_call(TO, DATA, 'latest');
    result = res.result;
  });

  it('resolves with the RPC result', function () {
    assert.equal(result, '0x1');
  });

  it('targets the proxy module', function () {
    assert.equal(queryOf(transport).get('module'), 'proxy');
  });

  it('uses the eth_call action', function () {
    assert.equal(queryOf(transport).get('action'), 'eth_call');
  });

  it('sends the requested to address', function () {
    assert.equal(queryOf(transport).get('to'), TO);
  });

  it('sends the requested data', function () {
    assert.equal(queryOf(transport).get('data'), DATA);
  });

  it('sends the requested tag', function () {
    assert.equal(queryOf(transport).get('tag'), 'latest');
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
