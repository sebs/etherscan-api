import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const BLOCKNO = '24884529';

describe('block.getblocktxnscount', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({
      status: '1',
      result: { block: 24884529, txsCount: 87, internalTxsCount: 55, erc20TxsCount: 103, erc721TxsCount: 1, erc1155TxsCount: 0 },
    });
    transport = mocked.transport;
    const res = await mocked.api.block.getblocktxnscount(BLOCKNO);
    result = res.result;
  });

  it('resolves with the txsCount from the API result', function () {
    assert.equal(result.txsCount, 87);
  });

  it('targets the block module', function () {
    assert.equal(queryOf(transport).get('module'), 'block');
  });

  it('uses the getblocktxnscount action', function () {
    assert.equal(queryOf(transport).get('action'), 'getblocktxnscount');
  });

  it('sends the requested blockno', function () {
    assert.equal(queryOf(transport).get('blockno'), BLOCKNO);
  });

  it('sends the apikey', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });
});
