import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from './helpers.js';

const ADDRESS = '0x33990122638b9132ca29c723bdf037f1c891a925';
const FROM_BLOCK = '379224';
const TO_BLOCK = '400000';
const TOPIC0 = '0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545';

describe('log.getLogs', function () {

  describe('with only the provided optional params', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.log.getLogs(ADDRESS, FROM_BLOCK, TO_BLOCK, TOPIC0);
      result = res.result;
    });

    it('resolves with the API result', function () {
      assert.equal(result, 'ok');
    });

    it('targets the logs module', function () {
      assert.equal(queryOf(transport).get('module'), 'logs');
    });

    it('uses the getLogs action', function () {
      assert.equal(queryOf(transport).get('action'), 'getLogs');
    });

    it('sends the requested address', function () {
      assert.equal(queryOf(transport).get('address'), ADDRESS);
    });

    it('sends the fromBlock', function () {
      assert.equal(queryOf(transport).get('fromBlock'), FROM_BLOCK);
    });

    it('sends the toBlock', function () {
      assert.equal(queryOf(transport).get('toBlock'), TO_BLOCK);
    });

    it('sends topic0', function () {
      assert.equal(queryOf(transport).get('topic0'), TOPIC0);
    });

    it('omits topic1 when not provided', function () {
      assert.equal(queryOf(transport).get('topic1'), null);
    });

    it('omits topic2 when not provided', function () {
      assert.equal(queryOf(transport).get('topic2'), null);
    });

    it('omits topic3 when not provided', function () {
      assert.equal(queryOf(transport).get('topic3'), null);
    });

    it('omits the topic0_1_opr operator when not provided', function () {
      assert.equal(queryOf(transport).get('topic0_1_opr'), null);
    });

    it('omits the topic1_2_opr operator when not provided', function () {
      assert.equal(queryOf(transport).get('topic1_2_opr'), null);
    });

    it('omits the topic2_3_opr operator when not provided', function () {
      assert.equal(queryOf(transport).get('topic2_3_opr'), null);
    });

    it('omits the topic0_2_opr operator when not provided', function () {
      assert.equal(queryOf(transport).get('topic0_2_opr'), null);
    });

    it('sends the apikey', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
  });

  describe('when page and offset are supplied', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      await mocked.api.log.getLogs(
        ADDRESS,
        FROM_BLOCK, TO_BLOCK,
        undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        2, 50
      );
    });

    it('forwards the page', function () {
      assert.equal(queryOf(transport).get('page'), '2');
    });

    it('forwards the offset', function () {
      assert.equal(queryOf(transport).get('offset'), '50');
    });
  });
});
