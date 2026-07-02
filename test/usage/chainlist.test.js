import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, optionsOf } from '../helpers.js';

describe('usage.chainlist', function () {
  let transport;
  let result;
  let url;

  beforeEach(async function () {
    const mocked = mockApi({ result: [{ chainid: '1', chainname: 'Ethereum Mainnet' }] });
    transport = mocked.transport;
    const res = await mocked.api.usage.chainlist();
    result = res.result;
    url = transport.mock.calls[0].arguments[0];
  });

  it('resolves with an array result', function () {
    assert.ok(Array.isArray(result));
  });

  it('hits the dedicated /v2/chainlist path', function () {
    assert.ok(url.endsWith('/v2/chainlist'), `unexpected url: ${url}`);
  });

  it('does not hit the /v2/api path', function () {
    assert.ok(!url.includes('/v2/api'));
  });

  it('does not include the apikey', function () {
    assert.ok(!url.includes('apikey'));
  });

  it('is not a POST request', function () {
    assert.notEqual(optionsOf(transport).method, 'POST');
  });
});
