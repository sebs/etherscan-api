import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { EtherscanError } from '../../lib/index.js';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xabc';

describe('block.getblockreward', function () {

  describe('with a block number', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.block.getblockreward(2165403);
      result = res.result;
    });

    it('resolves with the API result', function () {
      assert.equal(result, 'ok');
    });

    it('targets the block module', function () {
      assert.equal(queryOf(transport).get('module'), 'block');
    });

    it('uses the getblockreward action', function () {
      assert.equal(queryOf(transport).get('action'), 'getblockreward');
    });

    // Regression: the block number used to be sent as `address`, with
    // blockno defaulting to 0 — silently returning the genesis reward.
    it('sends the passed blockno', function () {
      assert.equal(queryOf(transport).get('blockno'), '2165403');
    });

    it('sends no address', function () {
      assert.equal(queryOf(transport).get('address'), null);
    });

    it('sends the apikey', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
  });

  describe('with the deprecated (address, blockno) form', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      await mocked.api.block.getblockreward(ADDRESS, '12345');
    });

    it('sends the passed blockno', function () {
      assert.equal(queryOf(transport).get('blockno'), '12345');
    });

    it('drops the address the endpoint does not take', function () {
      assert.equal(queryOf(transport).get('address'), null);
    });
  });

  // Checked live: a block not mined yet answers status "0", "No record found"
  // and a result object whose fields are all null.
  describe('for a block with no record', function () {
    const NO_RECORD = {
      status: '0',
      message: 'No record found',
      result: { blockNumber: null, timeStamp: null, blockMiner: null, blockReward: null, uncles: null, uncleInclusionReward: null },
    };
    let error;

    beforeEach(async function () {
      const mocked = mockApi(NO_RECORD);
      error = await mocked.api.block.getblockreward(999999999).then(() => null, (e) => e);
    });

    it('rejects with an EtherscanError', function () {
      assert.ok(error instanceof EtherscanError);
    });

    it('names the block and the likely reason', function () {
      assert.match(error.message, /no block reward record for block 999999999.*not (been )?mined yet/i);
    });

    it("keeps Etherscan's own fields", function () {
      assert.deepEqual([error.status, error.responseMessage, error.result], ['0', 'No record found', NO_RECORD.result]);
    });
  });

  it('leaves other failures unchanged', async function () {
    const mocked = mockApi({ status: '0', message: 'NOTOK', result: 'Error! Invalid block number' });
    await assert.rejects(() => mocked.api.block.getblockreward('x'), (err) => err.message === 'Error! Invalid block number');
  });
});
