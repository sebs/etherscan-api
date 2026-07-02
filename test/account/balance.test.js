import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae';

describe('account.balance', function () {

  describe('with a single address', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.account.balance(ADDRESS);
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

    it('uses the balance action', function () {
      assert.equal(queryOf(transport).get('action'), 'balance');
    });

    it('defaults the tag to latest', function () {
      assert.equal(queryOf(transport).get('tag'), 'latest');
    });

    it('sends the requested address', function () {
      assert.equal(queryOf(transport).get('address'), ADDRESS);
    });
  });

  describe('with an array of addresses', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.account.balance(['0xaaa', '0xbbb']);
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

    it('uses the balancemulti action', function () {
      assert.equal(queryOf(transport).get('action'), 'balancemulti');
    });

    it('defaults the tag to latest', function () {
      assert.equal(queryOf(transport).get('tag'), 'latest');
    });

    it('sends the addresses comma-joined', function () {
      assert.equal(queryOf(transport).get('address'), '0xaaa,0xbbb');
    });
  });
});
