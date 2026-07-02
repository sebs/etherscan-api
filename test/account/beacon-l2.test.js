import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xabc';

describe('account beacon / L2 transfers', function () {
  for (const action of ['txsBeaconWithdrawal', 'getdeposittxs', 'getwithdrawaltxs']) {
    describe(`account.${action}`, function () {
      let transport;
      let result;

      beforeEach(async function () {
        const mocked = mockApi({ status: '1', result: 'ok' });
        transport = mocked.transport;
        const res = await mocked.api.account[action](ADDRESS);
        result = res.result;
      });

      it('resolves with the API result', function () {
        assert.equal(result, 'ok');
      });

      it('targets the account module', function () {
        assert.equal(queryOf(transport).get('module'), 'account');
      });

      it(`uses the ${action} action`, function () {
        assert.equal(queryOf(transport).get('action'), action);
      });

      it('sends the requested address', function () {
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

      it('sends the apikey', function () {
        assert.equal(queryOf(transport).get('apikey'), 'KEY');
      });
    });
  }
});
