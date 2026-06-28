import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { init } from '../lib/index.js';
import { EtherscanError } from '../lib/errors.js';
import { mockApi, queryOf, bodyOf } from './helpers.js';

describe('request layer (get-request)', function () {

  it('injects apikey (lowercase) and chainid into every request', async function () {
    const { api, transport } = mockApi({ status: '1', message: 'OK', result: '42' }, { apiKey: 'MYKEY' });

    const res = await api.stats.ethsupply();
    assert.equal(res.result, '42');

    const q = queryOf(transport);
    assert.equal(q.get('apikey'), 'MYKEY');   // regression guard: lowercase, not "apiKey"
    assert.equal(q.get('chainid'), '1');
    assert.equal(q.get('module'), 'stats');
    assert.equal(q.get('action'), 'ethsupply');
  });

  it('uses the resolved chainid for the selected chain', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' }, { chain: 'sepolia' });

    await api.stats.ethsupply();
    assert.equal(queryOf(transport).get('chainid'), '11155111');
  });

  it('targets the V2 endpoint on the etherscan host', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    await api.stats.ethsupply();
    const url = transport.mock.calls[0].arguments[0];
    assert.ok(url.startsWith('https://api.etherscan.io/v2/api?'));
  });

  it('resolves the response body on success (status "1")', async function () {
    const { api } = mockApi({ status: '1', message: 'OK', result: '123' });

    const res = await api.account.balance('0xabc');
    assert.equal(res.status, '1');
    assert.equal(res.result, '123');
  });

  it('rejects with EtherscanError when status is "0"', async function () {
    const { api } = mockApi({ status: '0', message: 'NOTOK', result: 'Invalid address format' });

    await assert.rejects(
      () => api.account.balance('bad'),
      err => {
        assert.ok(err instanceof EtherscanError);
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'Invalid address format');
        assert.equal(err.status, '0');
        return true;
      }
    );
  });

  it('resolves (not rejects) an empty result reported as status "0" with an array', async function () {
    const { api } = mockApi({ status: '0', message: 'No transactions found', result: [] });

    const res = await api.account.txlist('0xabc');
    assert.equal(res.status, '0');
    assert.deepEqual(res.result, []);
  });

  it('resolves an empty result identified by the "No records found" message', async function () {
    const { api } = mockApi({ status: '0', message: 'No records found', result: '' });

    const res = await api.account.tokentx('0xabc');
    assert.equal(res.message, 'No records found');
  });

  it('rejects with EtherscanError for a JSON-RPC proxy error object', async function () {
    const { api } = mockApi({ jsonrpc: '2.0', id: 1, error: { code: -32602, message: 'invalid argument' } });

    await assert.rejects(
      () => api.proxy.eth_getBlockByNumber('0xbad'),
      err => {
        assert.ok(err instanceof EtherscanError);
        assert.equal(err.message, 'invalid argument');
        return true;
      }
    );
  });

  it('passes JSON-RPC proxy success through (no status field)', async function () {
    const { api } = mockApi({ jsonrpc: '2.0', id: 1, result: '0x10d4f' });

    const res = await api.proxy.eth_blockNumber();
    assert.equal(res.result, '0x10d4f');
  });

  it('propagates a transport error (e.g. non-2xx / network failure)', async function () {
    const { api } = mockApi(() => Promise.reject(new Error('Request failed with status code 500')));

    await assert.rejects(() => api.stats.ethsupply(), /status code 500/);
  });

  it('strips prototype-polluting keys from forwarded params', async function () {
    const { api, transport } = mockApi({ status: '1', message: 'OK', result: 'guid' });

    // JSON.parse yields a genuine own `__proto__` key (object-literal `__proto__`
    // would set the prototype instead of creating an enumerable property).
    const params = JSON.parse(
      '{"contractaddress":"0xabc","sourceCode":"x","contractname":"C",' +
        '"__proto__":"polluted","constructor":"polluted","prototype":"polluted"}',
    );

    await api.contract.verifyvyper(params);

    const body = bodyOf(transport);
    // These are the load-bearing assertions: the dangerous keys must not reach
    // the forwarded request body.
    assert.equal(body.get('__proto__'), null);
    assert.equal(body.get('constructor'), null);
    assert.equal(body.get('prototype'), null);
    // Legitimate fields still pass through.
    assert.equal(body.get('contractaddress'), '0xabc');
    assert.equal(body.get('contractname'), 'C');
  });

  it('honours a caller-supplied transport function', async function () {
    let calledUrl;
    const request = function (url) {
      calledUrl = url;
      return Promise.resolve({ status: '1', result: 'ok' });
    };

    const api = init('K', null, 5000, request);
    const res = await api.stats.ethsupply();
    assert.equal(res.result, 'ok');
    assert.ok(calledUrl.includes('apikey=K'));
    assert.ok(calledUrl.includes('chainid=1'));
  });
});
