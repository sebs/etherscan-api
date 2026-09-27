import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf, optionsOf } from '../helpers.js';
import { EtherscanError } from '../../lib/errors.js';

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

// The polling example in examples.md reads the pending state from err.result.
describe('contract.checkverifystatus while verification is pending', function () {
  let error;

  beforeEach(async function () {
    const mocked = mockApi({ status: '0', message: 'NOTOK', result: 'Pending in queue' });
    error = await mocked.api.contract.checkverifystatus('myguid').then(() => null, (e) => e);
  });

  it('rejects with an EtherscanError', function () {
    assert.ok(error instanceof EtherscanError);
  });

  it('carries the status text on err.result', function () {
    assert.equal(error.result, 'Pending in queue');
  });
});
