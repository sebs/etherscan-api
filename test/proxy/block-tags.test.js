import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
  ];

  for (const [label, input, sent] of CASES) {
    it('eth_getBlockByNumber sends ' + label + ' as ' + sent, async function () {
      const mocked = mockApi(RPC_OK);
      await mocked.api.proxy.eth_getBlockByNumber(input);
      assert.equal(queryOf(mocked.transport).get('tag'), sent);
    });
  }

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
});
