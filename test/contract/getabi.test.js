import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413';

describe('contract.getabi', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    transport = mocked.transport;
    const res = await mocked.api.contract.getabi(ADDRESS);
    result = res.result;
  });

  it('resolves with the API result', function () {
    assert.equal(result, 'ok');
  });

  it('targets the contract module', function () {
    assert.equal(queryOf(transport).get('module'), 'contract');
  });

  it('uses the getabi action', function () {
    assert.equal(queryOf(transport).get('action'), 'getabi');
  });

  it('sends the requested address', function () {
    assert.equal(queryOf(transport).get('address'), ADDRESS);
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
