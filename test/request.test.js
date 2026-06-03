'use strict';
const assert = require('chai').assert;
const nock = require('nock');
const axios = require('axios');
const { init } = require('..');
const { EtherscanError } = require('../lib/errors');

const HOST = 'https://api.etherscan.io';

describe('request layer (get-request)', function () {

  it('injects apikey (lowercase) and chainid into every request', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.apikey === 'MYKEY' &&        // regression guard: lowercase, not "apiKey"
        q.chainid === '1' &&
        q.module === 'stats' &&
        q.action === 'ethsupply')
      .reply(200, { status: '1', message: 'OK', result: '42' });

    const api = init('MYKEY');
    return api.stats.ethsupply().then(res => {
      assert.equal(res.result, '42');
      scope.done();
    });
  });

  it('uses the resolved chainid for the selected chain', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q => q.chainid === '11155111' && q.apikey === 'K')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('K', 'sepolia');
    return api.stats.ethsupply().then(() => scope.done());
  });

  it('resolves the response body on success (status "1")', function () {
    nock(HOST).get('/v2/api').query(true)
      .reply(200, { status: '1', message: 'OK', result: '123' });

    const api = init('K');
    return api.account.balance('0xabc').then(res => {
      assert.equal(res.status, '1');
      assert.equal(res.result, '123');
    });
  });

  it('rejects with EtherscanError when status is "0"', function () {
    nock(HOST).get('/v2/api').query(true)
      .reply(200, { status: '0', message: 'NOTOK', result: 'Invalid address format' });

    const api = init('K');
    return api.account.balance('bad').then(
      () => assert.fail('should have rejected'),
      err => {
        assert.instanceOf(err, EtherscanError);
        assert.instanceOf(err, Error);
        assert.equal(err.message, 'Invalid address format');
        assert.equal(err.status, '0');
      }
    );
  });

  it('rejects with EtherscanError for a JSON-RPC proxy error object', function () {
    nock(HOST).get('/v2/api').query(true)
      .reply(200, { jsonrpc: '2.0', id: 1, error: { code: -32602, message: 'invalid argument' } });

    const api = init('K');
    return api.proxy.eth_getBlockByNumber('0xbad').then(
      () => assert.fail('should have rejected'),
      err => {
        assert.instanceOf(err, EtherscanError);
        assert.equal(err.message, 'invalid argument');
      }
    );
  });

  it('passes JSON-RPC proxy success through (no status field)', function () {
    nock(HOST).get('/v2/api').query(true)
      .reply(200, { jsonrpc: '2.0', id: 1, result: '0x10d4f' });

    const api = init('K');
    return api.proxy.eth_blockNumber().then(res => {
      assert.equal(res.result, '0x10d4f');
    });
  });

  it('rejects with an Error on network/HTTP failure', function () {
    nock(HOST).get('/v2/api').query(true).reply(500, 'boom');

    const api = init('K');
    return api.stats.ethsupply().then(
      () => assert.fail('should have rejected'),
      err => assert.instanceOf(err, Error)
    );
  });

  it('honours a caller-supplied axios client', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q => q.apikey === 'K' && q.chainid === '1')
      .reply(200, { status: '1', result: 'ok' });

    const client = axios.create({ baseURL: HOST, timeout: 5000 });
    const api = init('K', null, 5000, client);
    return api.stats.ethsupply().then(() => scope.done());
  });
});
