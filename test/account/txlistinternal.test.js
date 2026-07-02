import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const TXHASH = '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170';
const ADDRESS = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae';

describe('account.txlistinternal', function () {

  describe('by txhash', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.account.txlistinternal(TXHASH);
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

    it('uses the txlistinternal action', function () {
      assert.equal(queryOf(transport).get('action'), 'txlistinternal');
    });

    it('defaults the sort to asc', function () {
      assert.equal(queryOf(transport).get('sort'), 'asc');
    });

    it('sends the txhash', function () {
      assert.equal(queryOf(transport).get('txhash'), TXHASH);
    });

    it('omits the address', function () {
      assert.equal(queryOf(transport).get('address'), null);
    });

    it('omits the startblock', function () {
      assert.equal(queryOf(transport).get('startblock'), null);
    });

    it('omits the endblock', function () {
      assert.equal(queryOf(transport).get('endblock'), null);
    });
  });

  describe('by address with range defaults', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.account.txlistinternal(null, ADDRESS);
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

    it('uses the txlistinternal action', function () {
      assert.equal(queryOf(transport).get('action'), 'txlistinternal');
    });

    it('defaults the sort to asc', function () {
      assert.equal(queryOf(transport).get('sort'), 'asc');
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

    it('omits the txhash', function () {
      assert.equal(queryOf(transport).get('txhash'), null);
    });
  });
});
