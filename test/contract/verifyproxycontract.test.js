import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, bodyOf, optionsOf } from '../helpers.js';

describe('contract.verifyproxycontract', function () {
  let transport;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'g' });
    transport = mocked.transport;
    await mocked.api.contract.verifyproxycontract('0xproxy', '0ximpl');
  });

  it('uses the POST method', function () {
    assert.equal(optionsOf(transport).method, 'POST');
  });

  it('uses the verifyproxycontract action', function () {
    assert.equal(bodyOf(transport).get('action'), 'verifyproxycontract');
  });

  it('sends the proxy address', function () {
    assert.equal(bodyOf(transport).get('address'), '0xproxy');
  });

  it('sends the expected implementation address', function () {
    assert.equal(bodyOf(transport).get('expectedimplementation'), '0ximpl');
  });
});
