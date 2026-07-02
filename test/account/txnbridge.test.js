import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0x4880bd4695a8e59dc527d124085749744b6c988e';

describe('account.txnbridge', function () {

  describe('with defaults', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: [] });
      transport = mocked.transport;
      const res = await mocked.api.account.txnbridge(ADDRESS);
      result = res.result;
    });

    it('resolves with an array result', function () {
      assert.ok(Array.isArray(result));
    });

    it('targets the account module', function () {
      assert.equal(queryOf(transport).get('module'), 'account');
    });

    it('uses the txnbridge action', function () {
      assert.equal(queryOf(transport).get('action'), 'txnbridge');
    });

    it('sends the requested address', function () {
      assert.equal(queryOf(transport).get('address'), ADDRESS);
    });

    it('defaults the page to 1', function () {
      assert.equal(queryOf(transport).get('page'), '1');
    });

    it('defaults the offset to 100', function () {
      assert.equal(queryOf(transport).get('offset'), '100');
    });

    it('omits the startblock', function () {
      assert.equal(queryOf(transport).get('startblock'), null);
    });

    it('omits the endblock', function () {
      assert.equal(queryOf(transport).get('endblock'), null);
    });

    it('omits the sort', function () {
      assert.equal(queryOf(transport).get('sort'), null);
    });

    it('sends the apikey', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
  });

  describe('with explicit page/offset', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: [] });
      transport = mocked.transport;
      await mocked.api.account.txnbridge('0xabc', 3, 25);
    });

    it('sends the explicit page', function () {
      assert.equal(queryOf(transport).get('page'), '3');
    });

    it('sends the explicit offset', function () {
      assert.equal(queryOf(transport).get('offset'), '25');
    });
  });
});
