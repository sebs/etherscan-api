import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EtherscanArgumentError } from '../../lib/index.js';
import { mockApi, queryOf } from '../helpers.js';

const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };

// JSON-RPC takes hex quantities; the rest of the library takes decimal block
// numbers, so decimal input is converted and named/hex tags pass through.
describe('proxy block tags', function () {
  const CASES = [
    ['a number', 123, '0x7b'],
    ['a decimal string', '123', '0x7b'],
    ['zero', 0, '0x0'],
    ['a hex tag', '0x10d4f', '0x10d4f'],
    ['latest', 'latest', 'latest'],
    // Checked live: the node rejects these spellings, so they are normalised.
    ['an uppercase 0X prefix', '0X10D4F', '0x10d4f'],
    ['hex with leading zeros', '0x010d4f', '0x10d4f'],
    ['hex zero with leading zeros', '0x00', '0x0'],
    ['an uppercase named tag', 'LATEST', 'latest'],
    ['a capitalised named tag', 'Pending', 'pending'],
  ];

  for (const [label, input, sent] of CASES) {
    it('eth_getBlockByNumber sends ' + label + ' as ' + sent, async function () {
      const mocked = mockApi(RPC_OK);
      await mocked.api.proxy.eth_getBlockByNumber(input);
      assert.equal(queryOf(mocked.transport).get('tag'), sent);
    });
  }

  it('normalises a hex index too', async function () {
    const mocked = mockApi(RPC_OK);
    await mocked.api.proxy.eth_getTransactionByBlockNumberAndIndex('0x7b', '0X0A');
    assert.equal(queryOf(mocked.transport).get('index'), '0xa');
  });

  it('converts the index too (eth_getTransactionByBlockNumberAndIndex)', async function () {
    const mocked = mockApi(RPC_OK);
    await mocked.api.proxy.eth_getTransactionByBlockNumberAndIndex(123, 10);
    const query = queryOf(mocked.transport);
    assert.deepEqual([query.get('tag'), query.get('index')], ['0x7b', '0xa']);
  });

  for (const [name, call] of [
    ['eth_getBlockTransactionCountByNumber', (api) => api.proxy.eth_getBlockTransactionCountByNumber(16)],
    ['eth_getUncleByBlockNumberAndIndex', (api) => api.proxy.eth_getUncleByBlockNumberAndIndex(16, 0)],
    ['eth_getTransactionCount', (api) => api.proxy.eth_getTransactionCount('0xa', 16)],
    ['eth_call', (api) => api.proxy.eth_call('0xa', '0x', 16)],
    ['eth_getCode', (api) => api.proxy.eth_getCode('0xa', 16)],
    ['eth_getStorageAt', (api) => api.proxy.eth_getStorageAt('0xa', '0x0', 16)],
  ]) {
    it(name + ' converts a decimal block number', async function () {
      const mocked = mockApi(RPC_OK);
      await call(mocked.api);
      assert.equal(queryOf(mocked.transport).get('tag'), '0x10');
    });
  }

  for (const bad of [-1, 1.5]) {
    it('rejects the invalid block number ' + bad + ' without calling the API', async function () {
      const mocked = mockApi(RPC_OK);
      await assert.rejects(() => mocked.api.proxy.eth_getBlockByNumber(bad), /Invalid block number/);
      assert.equal(mocked.transport.mock.callCount(), 0);
    });
  }

  // Checked live: 'safe' and 'finalized' work for the state reads but fail
  // with "invalid hex string" on the block lookups and eth_getTransactionCount.
  const A = '0x' + 'a'.repeat(40);
  const BLOCK_LOOKUPS = {
    eth_getBlockByNumber: (api, tag) => api.proxy.eth_getBlockByNumber(tag),
    eth_getBlockTransactionCountByNumber: (api, tag) => api.proxy.eth_getBlockTransactionCountByNumber(tag),
    eth_getTransactionByBlockNumberAndIndex: (api, tag) => api.proxy.eth_getTransactionByBlockNumberAndIndex(tag, 0),
    eth_getUncleByBlockNumberAndIndex: (api, tag) => api.proxy.eth_getUncleByBlockNumberAndIndex(tag, 0),
    eth_getTransactionCount: (api, tag) => api.proxy.eth_getTransactionCount(A, tag),
  };
  const STATE_READS = {
    eth_call: (api, tag) => api.proxy.eth_call(A, '0x', tag),
    eth_getCode: (api, tag) => api.proxy.eth_getCode(A, tag),
    eth_getStorageAt: (api, tag) => api.proxy.eth_getStorageAt(A, '0x0', tag),
  };

  for (const [name, call] of Object.entries(BLOCK_LOOKUPS)) {
    for (const tag of ['safe', 'finalized', 'Safe']) {
      it(name + ' rejects ' + tag + ' before any request', async function () {
        const mocked = mockApi(RPC_OK);
        await assert.rejects(
          () => call(mocked.api, tag),
          (err) => err instanceof EtherscanArgumentError && err.argument === 'tag' && /'latest', 'pending' or 'earliest'/.test(err.message),
        );
        assert.equal(mocked.transport.mock.callCount(), 0);
      });
    }
  }

  for (const [name, call] of Object.entries(STATE_READS)) {
    for (const tag of ['safe', 'finalized']) {
      it(name + ' sends ' + tag, async function () {
        const mocked = mockApi(RPC_OK);
        await call(mocked.api, tag);
        assert.equal(queryOf(mocked.transport).get('tag'), tag);
      });
    }
  }

  for (const [name, call] of Object.entries({ ...BLOCK_LOOKUPS, ...STATE_READS })) {
    it(name + ' rejects an unknown tag name before any request', async function () {
      const mocked = mockApi(RPC_OK);
      await assert.rejects(() => call(mocked.api, 'earliest-ish'), EtherscanArgumentError);
      assert.equal(mocked.transport.mock.callCount(), 0);
    });
  }

  it('rejects a named tag as an index, before any request', async function () {
    const mocked = mockApi(RPC_OK);
    await assert.rejects(
      () => mocked.api.proxy.eth_getTransactionByBlockNumberAndIndex('latest', 'latest'),
      (err) => err instanceof EtherscanArgumentError && err.argument === 'index',
    );
    assert.equal(mocked.transport.mock.callCount(), 0);
  });
});
