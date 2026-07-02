import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const TXHASH = '0xdeadbeef';

describe('transaction.gettxreceiptstatus', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    transport = mocked.transport;
    const res = await mocked.api.transaction.gettxreceiptstatus(TXHASH);
    result = res.result;
  });

  it('resolves with the API result', function () {
    assert.equal(result, 'ok');
  });

  it('targets the transaction module', function () {
    assert.equal(queryOf(transport).get('module'), 'transaction');
  });

  it('uses the gettxreceiptstatus action', function () {
    assert.equal(queryOf(transport).get('action'), 'gettxreceiptstatus');
  });

  it('sends the requested txhash', function () {
    assert.equal(queryOf(transport).get('txhash'), TXHASH);
  });
});
