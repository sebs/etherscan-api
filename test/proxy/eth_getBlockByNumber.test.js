import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const RPC_OK = { jsonrpc: '2.0', id: 1, result: '0x1' };
const TAG = '0x10d4f';

describe('proxy.eth_getBlockByNumber', function () {
  describe('boolean defaults to true', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi(RPC_OK);
      transport = mocked.transport;
      const res = await mocked.api.proxy.eth_getBlockByNumber(TAG);
      result = res.result;
    });

    it('resolves with the RPC result', function () {
      assert.equal(result, '0x1');
    });

    it('targets the proxy module', function () {
      assert.equal(queryOf(transport).get('module'), 'proxy');
    });

    it('uses the eth_getBlockByNumber action', function () {
      assert.equal(queryOf(transport).get('action'), 'eth_getBlockByNumber');
    });

    it('sends the requested tag', function () {
      assert.equal(queryOf(transport).get('tag'), TAG);
    });

    it('defaults the boolean param to true', function () {
      assert.equal(queryOf(transport).get('boolean'), 'true');
    });

    it('sends the api key', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
  });

  describe('boolean false when passed', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi(RPC_OK);
      transport = mocked.transport;
      const res = await mocked.api.proxy.eth_getBlockByNumber(TAG, false);
      result = res.result;
    });

    it('resolves with the RPC result', function () {
      assert.equal(result, '0x1');
    });

    it('targets the proxy module', function () {
      assert.equal(queryOf(transport).get('module'), 'proxy');
    });

    it('uses the eth_getBlockByNumber action', function () {
      assert.equal(queryOf(transport).get('action'), 'eth_getBlockByNumber');
    });

    it('sends the requested tag', function () {
      assert.equal(queryOf(transport).get('tag'), TAG);
    });

    it('sends the boolean param as false', function () {
      assert.equal(queryOf(transport).get('boolean'), 'false');
    });

    it('sends the api key', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
  });
});
