import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

describe('contract.checkproxyverification', function () {
  let transport;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    transport = mocked.transport;
    await mocked.api.contract.checkproxyverification('myguid');
  });

  it('uses the checkproxyverification action', function () {
    assert.equal(queryOf(transport).get('action'), 'checkproxyverification');
  });

  it('sends the guid', function () {
    assert.equal(queryOf(transport).get('guid'), 'myguid');
  });
});
