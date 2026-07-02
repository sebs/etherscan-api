import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0x4366ddc115d8cf213c564da36e64c8ebaa30cdbd';
const CONTRACT = '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a';

describe('account.tokenbalance', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    transport = mocked.transport;
    const res = await mocked.api.account.tokenbalance(ADDRESS, '', CONTRACT);
    result = res.result;
  });

  it('resolves with the API result', function () {
    assert.equal(result, 'ok');
  });

  it('sends the apikey', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });

  it('targets the account module', function () {
    assert.equal(queryOf(transport).get('module'), 'account');
  });

  it('uses the tokenbalance action', function () {
    assert.equal(queryOf(transport).get('action'), 'tokenbalance');
  });

  it('defaults the tag to latest', function () {
    assert.equal(queryOf(transport).get('tag'), 'latest');
  });

  it('sends the requested address', function () {
    assert.equal(queryOf(transport).get('address'), ADDRESS);
  });

  it('sends the contract address', function () {
    assert.equal(queryOf(transport).get('contractaddress'), CONTRACT);
  });
});
