import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

describe('stats.nodecount', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    transport = mocked.transport;
    const res = await mocked.api.stats.nodecount();
    result = res.result;
  });

  it('resolves with the API result', function () {
    assert.equal(result, 'ok');
  });

  it('targets the stats module', function () {
    assert.equal(queryOf(transport).get('module'), 'stats');
  });

  it('uses the nodecount action', function () {
    assert.equal(queryOf(transport).get('action'), 'nodecount');
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
