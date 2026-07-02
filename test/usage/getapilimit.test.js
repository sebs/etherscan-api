import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

describe('usage.getapilimit', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: { limit: '100000', used: '1' } });
    transport = mocked.transport;
    const res = await mocked.api.usage.getapilimit();
    result = res.result;
  });

  it('resolves with a truthy API result', function () {
    assert.ok(result);
  });

  it('targets the getapilimit module', function () {
    assert.equal(queryOf(transport).get('module'), 'getapilimit');
  });

  it('uses the getapilimit action', function () {
    assert.equal(queryOf(transport).get('action'), 'getapilimit');
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
