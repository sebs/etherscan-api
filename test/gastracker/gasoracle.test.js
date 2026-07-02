import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

describe('gastracker.gasoracle', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    transport = mocked.transport;
    const res = await mocked.api.gastracker.gasoracle();
    result = res.result;
  });

  it('resolves with the API result', function () {
    assert.equal(result, 'ok');
  });

  it('targets the gastracker module', function () {
    assert.equal(queryOf(transport).get('module'), 'gastracker');
  });

  it('uses the gasoracle action', function () {
    assert.equal(queryOf(transport).get('action'), 'gasoracle');
  });

  it('sends the api key', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
