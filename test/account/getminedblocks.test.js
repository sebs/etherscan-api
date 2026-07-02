import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b';

describe('account.getminedblocks', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    transport = mocked.transport;
    const res = await mocked.api.account.getminedblocks(ADDRESS);
    result = res.result;
  });

  it('resolves with the API result', function () {
    assert.equal(result, 'ok');
  });

  it('targets the account module', function () {
    assert.equal(queryOf(transport).get('module'), 'account');
  });

  it('uses the getminedblocks action', function () {
    assert.equal(queryOf(transport).get('action'), 'getminedblocks');
  });

  it('sends the requested address', function () {
    assert.equal(queryOf(transport).get('address'), ADDRESS);
  });
});
