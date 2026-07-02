import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xabc';

describe('account.fundedby', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    transport = mocked.transport;
    const res = await mocked.api.account.fundedby(ADDRESS);
    result = res.result;
  });

  it('resolves with the API result', function () {
    assert.equal(result, 'ok');
  });

  it('targets the account module', function () {
    assert.equal(queryOf(transport).get('module'), 'account');
  });

  it('uses the fundedby action', function () {
    assert.equal(queryOf(transport).get('action'), 'fundedby');
  });

  it('sends the requested address', function () {
    assert.equal(queryOf(transport).get('address'), ADDRESS);
  });

  it('omits the startblock', function () {
    assert.equal(queryOf(transport).get('startblock'), null);
  });
});
