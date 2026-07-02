import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { init } from '../lib/index.js';
import { EtherscanError } from '../lib/errors.js';
import { mockApi, queryOf, bodyOf } from './helpers.js';

describe('request layer (get-request)', function () {

  describe('injects apikey (lowercase) and chainid into every request', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', message: 'OK', result: '42' }, { apiKey: 'MYKEY' });
      transport = mocked.transport;
      const res = await mocked.api.stats.ethsupply();
      result = res.result;
    });

    it('resolves with the API result', function () {
      assert.equal(result, '42');
    });

    it('sends apikey lowercase (regression guard: not "apiKey")', function () {
      assert.equal(queryOf(transport).get('apikey'), 'MYKEY');
    });

    it('sends the chainid', function () {
      assert.equal(queryOf(transport).get('chainid'), '1');
    });

    it('targets the stats module', function () {
      assert.equal(queryOf(transport).get('module'), 'stats');
    });

    it('uses the ethsupply action', function () {
      assert.equal(queryOf(transport).get('action'), 'ethsupply');
    });
  });

  describe('uses the resolved chainid for the selected chain', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' }, { chain: 'sepolia' });
      transport = mocked.transport;
      await mocked.api.stats.ethsupply();
    });

    it('resolves the sepolia chainid', function () {
      assert.equal(queryOf(transport).get('chainid'), '11155111');
    });
  });

  describe('targets the V2 endpoint on the etherscan host', function () {
    let url;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      await mocked.api.stats.ethsupply();
      url = mocked.transport.mock.calls[0].arguments[0];
    });

    it('points at the V2 etherscan API url', function () {
      assert.ok(url.startsWith('https://api.etherscan.io/v2/api?'));
    });
  });

  describe('resolves the response body on success (status "1")', function () {
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', message: 'OK', result: '123' });
      result = await mocked.api.account.balance('0xabc');
    });

    it('resolves with status "1"', function () {
      assert.equal(result.status, '1');
    });

    it('resolves with the result value', function () {
      assert.equal(result.result, '123');
    });
  });

  describe('rejects with EtherscanError when status is "0"', function () {
    let error;

    beforeEach(async function () {
      const mocked = mockApi({ status: '0', message: 'NOTOK', result: 'Invalid address format' });
      error = await mocked.api.account.balance('bad').then(function () { return null; }, function (e) { return e; });
    });

    it('throws an EtherscanError', function () {
      assert.ok(error instanceof EtherscanError);
    });

    it('throws an Error', function () {
      assert.ok(error instanceof Error);
    });

    it('uses the API message as the error message', function () {
      assert.equal(error.message, 'Invalid address format');
    });

    it('exposes the status on the error', function () {
      assert.equal(error.status, '0');
    });
  });

  describe('resolves (not rejects) an empty result reported as status "0" with an array', function () {
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '0', message: 'No transactions found', result: [] });
      result = await mocked.api.account.txlist('0xabc');
    });

    it('resolves with status "0"', function () {
      assert.equal(result.status, '0');
    });

    it('resolves with the empty array result', function () {
      assert.deepEqual(result.result, []);
    });
  });

  describe('resolves an empty result identified by the "No records found" message', function () {
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '0', message: 'No records found', result: '' });
      result = await mocked.api.account.tokentx('0xabc');
    });

    it('resolves with the "No records found" message', function () {
      assert.equal(result.message, 'No records found');
    });
  });

  describe('rejects with EtherscanError for a JSON-RPC proxy error object', function () {
    let error;

    beforeEach(async function () {
      const mocked = mockApi({ jsonrpc: '2.0', id: 1, error: { code: -32602, message: 'invalid argument' } });
      error = await mocked.api.proxy.eth_getBlockByNumber('0xbad').then(function () { return null; }, function (e) { return e; });
    });

    it('throws an EtherscanError', function () {
      assert.ok(error instanceof EtherscanError);
    });

    it('uses the JSON-RPC error message', function () {
      assert.equal(error.message, 'invalid argument');
    });
  });

  describe('passes JSON-RPC proxy success through (no status field)', function () {
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ jsonrpc: '2.0', id: 1, result: '0x10d4f' });
      result = await mocked.api.proxy.eth_blockNumber();
    });

    it('resolves with the JSON-RPC result', function () {
      assert.equal(result.result, '0x10d4f');
    });
  });

  describe('propagates a transport error (e.g. non-2xx / network failure)', function () {
    let api;

    beforeEach(function () {
      const mocked = mockApi(function () { return Promise.reject(new Error('Request failed with status code 500')); });
      api = mocked.api;
    });

    it('rejects with the transport error', async function () {
      await assert.rejects(function () { return api.stats.ethsupply(); }, /status code 500/);
    });
  });

  describe('strips prototype-polluting keys from forwarded params', function () {
    let body;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', message: 'OK', result: 'guid' });

      // JSON.parse yields a genuine own `__proto__` key (object-literal `__proto__`
      // would set the prototype instead of creating an enumerable property).
      const params = JSON.parse(
        '{"contractaddress":"0xabc","sourceCode":"x","contractname":"C",' +
          '"__proto__":"polluted","constructor":"polluted","prototype":"polluted"}',
      );

      await mocked.api.contract.verifyvyper(params);
      body = bodyOf(mocked.transport);
    });

    it('does not forward the __proto__ key', function () {
      assert.equal(body.get('__proto__'), null);
    });

    it('does not forward the constructor key', function () {
      assert.equal(body.get('constructor'), null);
    });

    it('does not forward the prototype key', function () {
      assert.equal(body.get('prototype'), null);
    });

    it('forwards the legitimate contractaddress field', function () {
      assert.equal(body.get('contractaddress'), '0xabc');
    });

    it('forwards the legitimate contractname field', function () {
      assert.equal(body.get('contractname'), 'C');
    });
  });

  describe('honours a caller-supplied transport function', function () {
    let calledUrl;
    let result;

    beforeEach(async function () {
      const request = function (url) {
        calledUrl = url;
        return Promise.resolve({ status: '1', result: 'ok' });
      };

      const api = init('K', null, 5000, request);
      result = await api.stats.ethsupply();
    });

    it('resolves with the custom transport result', function () {
      assert.equal(result.result, 'ok');
    });

    it('passes the apikey through to the custom transport url', function () {
      assert.ok(calledUrl.includes('apikey=K'));
    });

    it('passes the chainid through to the custom transport url', function () {
      assert.ok(calledUrl.includes('chainid=1'));
    });
  });
});
