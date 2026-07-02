import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf, optionsOf } from '../helpers.js';

describe('contract.checkverifystatus', function () {
  let transport;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'Pass - Verified' });
    transport = mocked.transport;
    await mocked.api.contract.checkverifystatus('myguid');
  });

  it('does not use the POST method', function () {
    assert.notEqual(optionsOf(transport).method, 'POST');
  });

  it('uses the checkverifystatus action', function () {
    assert.equal(queryOf(transport).get('action'), 'checkverifystatus');
  });

  it('sends the guid', function () {
    assert.equal(queryOf(transport).get('guid'), 'myguid');
  });
});
