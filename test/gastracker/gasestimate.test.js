import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const GAS_PRICE = 2000000000;

describe('gastracker.gasestimate', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: '12' });
    transport = mocked.transport;
    const res = await mocked.api.gastracker.gasestimate(GAS_PRICE);
    result = res.result;
  });

  it('resolves with the API result', function () {
    assert.equal(result, '12');
  });

  it('targets the gastracker module', function () {
    assert.equal(queryOf(transport).get('module'), 'gastracker');
  });

  it('uses the gasestimate action', function () {
    assert.equal(queryOf(transport).get('action'), 'gasestimate');
  });

  it('forwards the gas price', function () {
    assert.equal(queryOf(transport).get('gasprice'), '2000000000');
  });
});
