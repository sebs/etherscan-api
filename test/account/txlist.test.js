import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae';

describe('account.txlist', function () {

  describe('with defaults', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.account.txlist(ADDRESS);
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

    it('uses the txlist action', function () {
      assert.equal(queryOf(transport).get('action'), 'txlist');
    });

    it('sends the address', function () {
      assert.equal(queryOf(transport).get('address'), ADDRESS);
    });

    it('defaults the startblock to 0', function () {
      assert.equal(queryOf(transport).get('startblock'), '0');
    });

    it('defaults the endblock to latest', function () {
      assert.equal(queryOf(transport).get('endblock'), 'latest');
    });

    it('defaults the page to 1', function () {
      assert.equal(queryOf(transport).get('page'), '1');
    });

    it('defaults the offset to 100', function () {
      assert.equal(queryOf(transport).get('offset'), '100');
    });

    it('defaults the sort to asc', function () {
      assert.equal(queryOf(transport).get('sort'), 'asc');
    });
  });

  describe('with explicit params', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.account.txlist('0xabc', 5, 99, 2, 50, 'desc');
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

    it('uses the txlist action', function () {
      assert.equal(queryOf(transport).get('action'), 'txlist');
    });

    it('sends the address', function () {
      assert.equal(queryOf(transport).get('address'), '0xabc');
    });

    it('sends the explicit startblock', function () {
      assert.equal(queryOf(transport).get('startblock'), '5');
    });

    it('sends the explicit endblock', function () {
      assert.equal(queryOf(transport).get('endblock'), '99');
    });

    it('sends the explicit page', function () {
      assert.equal(queryOf(transport).get('page'), '2');
    });

    it('sends the explicit offset', function () {
      assert.equal(queryOf(transport).get('offset'), '50');
    });

    it('sends the explicit sort', function () {
      assert.equal(queryOf(transport).get('sort'), 'desc');
    });
  });
});
