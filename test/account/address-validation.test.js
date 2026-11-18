import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EtherscanArgumentError } from '../../lib/index.js';
import { mockApi, queryOf } from '../helpers.js';

// Checked live: Etherscan answers a malformed address on the account endpoints
// with a plausible success (balance('0x123') → "0", txlist('0xZZZ') → []), and
// a malformed hash on the transaction endpoints with "no error". So the library
// rejects those before any request.
const GOOD = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const HASH = '0x' + '1'.repeat(64);
const BAD = { 'too short': '0x123', 'non-hex': '0x' + 'z'.repeat(40), 'without 0x': GOOD.slice(2), 'too long': GOOD + '0' };

const addressCalls = {
  'balance': (api, a) => api.account.balance(a),
  'balance (array)': (api, a) => api.account.balance([GOOD, a]),
  'tokenbalance address': (api, a) => api.account.tokenbalance(a, undefined, GOOD),
  'tokenbalance contractaddress': (api, a) => api.account.tokenbalance(GOOD, undefined, a),
  'txlist': (api, a) => api.account.txlist(a),
  'txlist filter from': (api, a) => api.account.txlist(undefined, { filter: { from: a } }),
  'txlist filter to': (api, a) => api.account.txlist(undefined, { filter: { to: a } }),
  'txlistinternal address': (api, a) => api.account.txlistinternal({ address: a }),
  'tokentx address': (api, a) => api.account.tokentx(a),
  'tokentx contractaddress': (api, a) => api.account.tokentx(GOOD, { contractaddress: a }),
  'tokennfttx': (api, a) => api.account.tokennfttx(a),
  'token1155tx': (api, a) => api.account.token1155tx(a),
  'getminedblocks': (api, a) => api.account.getminedblocks(a),
  'txsBeaconWithdrawal': (api, a) => api.account.txsBeaconWithdrawal(a),
  'getdeposittxs': (api, a) => api.account.getdeposittxs(a),
  'getwithdrawaltxs': (api, a) => api.account.getwithdrawaltxs(a),
  'fundedby': (api, a) => api.account.fundedby(a),
  'txnbridge': (api, a) => api.account.txnbridge(a),
};

const hashCalls = {
  'txlistinternal txhash': (api, h) => api.account.txlistinternal({ txhash: h }),
  'getstatus': (api, h) => api.transaction.getstatus(h),
  'gettxreceiptstatus': (api, h) => api.transaction.gettxreceiptstatus(h),
};

describe('address and transaction-hash validation', function () {
  for (const [name, call] of Object.entries(addressCalls)) {
    describe(name, function () {
      for (const [kind, bad] of Object.entries(BAD)) {
        it('rejects an address ' + kind + ', before any request', async function () {
          const { api, transport } = mockApi({ status: '1', result: [] });
          await assert.rejects(() => call(api, bad), EtherscanArgumentError);
          assert.equal(transport.mock.callCount(), 0);
        });
      }

      it('accepts a well-formed address in any case', async function () {
        const { api, transport } = mockApi({ status: '1', result: [] });
        await call(api, GOOD.toLowerCase());
        await call(api, GOOD.toUpperCase().replace('0X', '0x'));
        assert.equal(transport.mock.callCount(), 2);
      });
    });
  }

  for (const [name, call] of Object.entries(hashCalls)) {
    describe(name, function () {
      for (const bad of ['0xdead', '0x' + 'g'.repeat(64), '1'.repeat(64)]) {
        it('rejects the hash ' + bad.slice(0, 10) + '…, before any request', async function () {
          const { api, transport } = mockApi({ status: '1', result: [] });
          await assert.rejects(() => call(api, bad), EtherscanArgumentError);
          assert.equal(transport.mock.callCount(), 0);
        });
      }

      it('accepts a well-formed hash', async function () {
        const { api, transport } = mockApi({ status: '1', result: [] });
        await call(api, HASH);
        assert.equal(transport.mock.callCount(), 1);
      });
    });
  }

  it('names the offending argument', async function () {
    const { api } = mockApi({ status: '1', result: '0' });
    await assert.rejects(
      () => api.account.tokenbalance(GOOD, undefined, '0x123'),
      (err) => err.argument === 'contractaddress' && /0x123/.test(err.message),
    );
  });

  it('does not check an address a txhash lookup ignores', async function () {
    const { api, transport } = mockApi({ status: '1', result: [] });
    await api.account.txlistinternal({ txhash: HASH, address: 'ignored' });
    assert.equal(queryOf(transport).get('address'), null);
  });
});
