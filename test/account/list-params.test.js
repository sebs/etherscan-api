import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae';

// Sort and paging are validated before any request: Etherscan rejects an
// unknown sort, a page/offset below 1, and page × offset above 10 000.
describe('account list params', function () {
  const METHODS = [
    ['txlist', (api, page, offset, sort) => api.account.txlist(ADDRESS, 0, 'latest', page, offset, sort)],
    ['tokentx', (api, page, offset, sort) => api.account.tokentx(ADDRESS, undefined, 0, 'latest', page, offset, sort)],
    ['txsBeaconWithdrawal', (api, page, offset, sort) => api.account.txsBeaconWithdrawal(ADDRESS, 0, 'latest', page, offset, sort)],
    ['txlistinternal', (api, page, offset, sort) => api.account.txlistinternal(undefined, ADDRESS, 0, 'latest', sort, undefined, page, offset)],
  ];

  for (const [name, call] of METHODS) {
    describe(name, function () {
      const REJECTED = [
        ['sort "DESC"', 1, 10, 'DESC', /Invalid sort "DESC"/],
        ['page 0', 0, 10, 'asc', /Invalid page 0/],
        ['offset 0', 1, 0, 'asc', /Invalid offset 0/],
        ['a fractional page', 1.5, 10, 'asc', /Invalid page 1.5/],
        ['page × offset over 10 000', 2, 10000, 'asc', /exceeds Etherscan's 10000-record result window/],
      ];

      for (const [label, page, offset, sort, pattern] of REJECTED) {
        it('rejects ' + label + ' without calling the API', async function () {
          const mocked = mockApi({ status: '1', result: [] });
          await assert.rejects(() => call(mocked.api, page, offset, sort), pattern);
          assert.equal(mocked.transport.mock.callCount(), 0);
        });
      }

      it('accepts page × offset of exactly 10 000 with sort desc', async function () {
        const mocked = mockApi({ status: '1', result: [] });
        await call(mocked.api, 1, 10000, 'desc');
        assert.equal(queryOf(mocked.transport).get('sort'), 'desc');
      });
    });
  }
});
