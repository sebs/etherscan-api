import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0xabc';

describe('block.getblockreward', function () {

  describe('with blockno omitted', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.block.getblockreward(ADDRESS);
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

    it('sends the requested address', function () {
      assert.equal(queryOf(transport).get('address'), ADDRESS);
    });

    it('defaults blockno to 0', function () {
      assert.equal(queryOf(transport).get('blockno'), '0');
    });

    it('sends the apikey', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
  });

  describe('with an explicit blockno', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.block.getblockreward(ADDRESS, '12345');
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

    it('sends the requested address', function () {
      assert.equal(queryOf(transport).get('address'), ADDRESS);
    });

    it('sends the passed blockno', function () {
      assert.equal(queryOf(transport).get('blockno'), '12345');
    });

    it('sends the apikey', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
  });
});
