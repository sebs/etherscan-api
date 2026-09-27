import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae';
const TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';

/** The query of one call, as a plain object. */
async function sent(call) {
  const mocked = mockApi({ status: '1', result: [] });
  await call(mocked.api);
  return Object.fromEntries(queryOf(mocked.transport));
}

// The options-object forms send exactly what the deprecated positional forms
// send, so either can be used during the migration.
describe('account list options', function () {
  const PAIRS = [
    [
      'txlist',
      (api) => api.account.txlist(ADDRESS, { startblock: 5, endblock: 9, page: 2, offset: 10, sort: 'desc' }),
      (api) => api.account.txlist(ADDRESS, 5, 9, 2, 10, 'desc'),
    ],
    [
      'txlist with a filter only',
      (api) => api.account.txlist(undefined, { filter: { from: ADDRESS, fromto_opr: 'or' } }),
      (api) => api.account.txlist(undefined, undefined, undefined, undefined, undefined, undefined, { from: ADDRESS, fromto_opr: 'or' }),
    ],
    [
      'tokentx',
      (api) => api.account.tokentx(ADDRESS, { contractaddress: TOKEN, page: 3, offset: 20 }),
      (api) => api.account.tokentx(ADDRESS, TOKEN, undefined, undefined, 3, 20),
    ],
    [
      'txsBeaconWithdrawal',
      (api) => api.account.txsBeaconWithdrawal(ADDRESS, { sort: 'desc' }),
      (api) => api.account.txsBeaconWithdrawal(ADDRESS, undefined, undefined, undefined, undefined, 'desc'),
    ],
    [
      'txlistinternal by address',
      (api) => api.account.txlistinternal({ address: ADDRESS, page: 1, offset: 50 }),
      (api) => api.account.txlistinternal(undefined, ADDRESS, undefined, undefined, undefined, undefined, 1, 50),
    ],
    [
      'txlistinternal by hash',
      (api) => api.account.txlistinternal({ txhash: '0xabc' }),
      (api) => api.account.txlistinternal('0xabc'),
    ],
  ];

  for (const [name, options, positional] of PAIRS) {
    it(name + ': the options form sends what the positional form sends', async function () {
      assert.deepEqual(await sent(options), await sent(positional));
    });
  }

  it('txlist with options still validates (sort)', async function () {
    const mocked = mockApi({ status: '1', result: [] });
    await assert.rejects(() => mocked.api.account.txlist(ADDRESS, { sort: 'DESC' }), /Invalid sort "DESC"/);
  });

  for (const [name, call] of [
    ['getminedblocks', (api) => api.account.getminedblocks(ADDRESS, 'blocks', 0, 10)],
    ['txnbridge', (api) => api.account.txnbridge(ADDRESS, 0, 10)],
  ]) {
    it(name + ' validates paging like the other lists', async function () {
      const mocked = mockApi({ status: '1', result: [] });
      await assert.rejects(() => call(mocked.api), /Invalid page 0/);
    });
  }

  // Etherscan answers these with 'Result window is too large' (checked live),
  // so the library rejects them before spending a request.
  for (const [name, call] of [
    ['getLogs', (api) => api.log.getLogs({ address: ADDRESS, page: 10001, offset: 1 })],
    ['txnbridge', (api) => api.account.txnbridge(ADDRESS, 10001, 1)],
  ]) {
    it(name + ' rejects page × offset past the 10 000-record window without calling the API', async function () {
      const mocked = mockApi({ status: '1', result: [] });
      await assert.rejects(() => call(mocked.api), /exceeds Etherscan's 10000-record result window/);
      assert.equal(mocked.transport.mock.callCount(), 0);
    });
  }
});
