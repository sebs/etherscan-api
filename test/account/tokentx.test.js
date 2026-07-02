import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae';
const CONTRACT = '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da';

describe('account.tokentx', function () {

  describe('with a contractaddress', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.account.tokentx(ADDRESS, CONTRACT);
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

    it('uses the tokentx action', function () {
      assert.equal(queryOf(transport).get('action'), 'tokentx');
    });

    it('sends the address', function () {
      assert.equal(queryOf(transport).get('address'), ADDRESS);
    });

    it('sends the contract address', function () {
      assert.equal(queryOf(transport).get('contractaddress'), CONTRACT);
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

  describe('without a contractaddress', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.account.tokentx(ADDRESS);
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

    it('uses the tokentx action', function () {
      assert.equal(queryOf(transport).get('action'), 'tokentx');
    });

    it('sends the address', function () {
      assert.equal(queryOf(transport).get('address'), ADDRESS);
    });

    it('omits the contract address', function () {
      assert.equal(queryOf(transport).get('contractaddress'), null);
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
});
