import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const TIMESTAMP = '1578638524';

describe('block.getblocknobytime', function () {

  describe('with closest omitted', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.block.getblocknobytime(TIMESTAMP);
      result = res.result;
    });

    it('resolves with the API result', function () {
      assert.equal(result, 'ok');
    });

    it('targets the block module', function () {
      assert.equal(queryOf(transport).get('module'), 'block');
    });

    it('uses the getblocknobytime action', function () {
      assert.equal(queryOf(transport).get('action'), 'getblocknobytime');
    });

    it('sends the requested timestamp', function () {
      assert.equal(queryOf(transport).get('timestamp'), TIMESTAMP);
    });

    it('defaults closest to "before"', function () {
      assert.equal(queryOf(transport).get('closest'), 'before');
    });
  });

  describe('with closest="after"', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      await mocked.api.block.getblocknobytime(TIMESTAMP, 'after');
    });

    it('sends closest="after"', function () {
      assert.equal(queryOf(transport).get('closest'), 'after');
    });
  });

  it('converts a Date to Unix seconds', async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    await mocked.api.block.getblocknobytime(new Date(1578638524000));
    assert.equal(queryOf(mocked.transport).get('timestamp'), '1578638524');
  });

  it('rejects a millisecond timestamp (Date.now()) without calling the API', async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    await assert.rejects(() => mocked.api.block.getblocknobytime(1578638524000), /looks like milliseconds/);
    assert.equal(mocked.transport.mock.callCount(), 0);
  });

  for (const bad of ['yesterday', -1, 1.5, new Date('nope')]) {
    it('rejects the invalid timestamp ' + String(bad), async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      await assert.rejects(() => mocked.api.block.getblocknobytime(bad), /Invalid timestamp/);
    });
  }
});
