import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xabc';

describe('block.getblockreward', function () {

  describe('with a block number', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.block.getblockreward(2165403);
      result = res.result;
    });

    it('resolves with the API result', function () {
      assert.equal(result, 'ok');
    });

    it('targets the block module', function () {
      assert.equal(queryOf(transport).get('module'), 'block');
    });

    it('uses the getblockreward action', function () {
      assert.equal(queryOf(transport).get('action'), 'getblockreward');
    });

    // Regression: the block number used to be sent as `address`, with
    // blockno defaulting to 0 — silently returning the genesis reward.
    it('sends the passed blockno', function () {
      assert.equal(queryOf(transport).get('blockno'), '2165403');
    });

    it('sends no address', function () {
      assert.equal(queryOf(transport).get('address'), null);
    });

    it('sends the apikey', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
  });

  describe('with the deprecated (address, blockno) form', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      await mocked.api.block.getblockreward(ADDRESS, '12345');
    });

    it('sends the passed blockno', function () {
      assert.equal(queryOf(transport).get('blockno'), '12345');
    });

    it('drops the address the endpoint does not take', function () {
      assert.equal(queryOf(transport).get('address'), null);
    });
  });
});
