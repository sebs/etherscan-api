import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413';

describe('contract.getcontractcreation', function () {

  describe('with a single address', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.contract.getcontractcreation(ADDRESS);
      result = res.result;
    });

    it('resolves with the API result', function () {
      assert.equal(result, 'ok');
    });

    it('targets the contract module', function () {
      assert.equal(queryOf(transport).get('module'), 'contract');
    });

    it('uses the getcontractcreation action', function () {
      assert.equal(queryOf(transport).get('action'), 'getcontractcreation');
    });

    it('sends the single address as contractaddresses', function () {
      assert.equal(queryOf(transport).get('contractaddresses'), ADDRESS);
    });
  });

  describe('with an array of addresses', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      await mocked.api.contract.getcontractcreation(['0xaaa', '0xbbb']);
    });

    it('joins the array into a comma-separated contractaddresses', function () {
      assert.equal(queryOf(transport).get('contractaddresses'), '0xaaa,0xbbb');
    });
  });
});
