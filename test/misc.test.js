'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const nock = require('nock');
const { init } = require('..');
const { installNock } = require('./helpers');

installNock();

const HOST = 'https://api.etherscan.io';

describe('stats namespace', function () {

  it('tokensupply by tokenname only', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'stats' &&
        q.action === 'tokensupply' &&
        q.tokenname === 'DGD' &&
        q.contractaddress === undefined &&
        q.apikey === 'KEY')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('KEY');
    return api.stats.tokensupply('DGD').then(res => {
      assert.equal(res.result, 'ok');
      scope.done();
    });
  });

  it('tokensupply by contractaddress only', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'stats' &&
        q.action === 'tokensupply' &&
        q.contractaddress === '0x57d90b64a1a57749b0f932f1a3395792e12e7055' &&
        q.tokenname === undefined &&
        q.apikey === 'KEY')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('KEY');
    return api.stats
      .tokensupply(null, '0x57d90b64a1a57749b0f932f1a3395792e12e7055')
      .then(res => {
        assert.equal(res.result, 'ok');
        scope.done();
      });
  });

  it('ethsupply', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'stats' &&
        q.action === 'ethsupply' &&
        q.apikey === 'KEY')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('KEY');
    return api.stats.ethsupply().then(res => {
      assert.equal(res.result, 'ok');
      scope.done();
    });
  });

  it('ethprice', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'stats' &&
        q.action === 'ethprice' &&
        q.apikey === 'KEY')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('KEY');
    return api.stats.ethprice().then(res => {
      assert.equal(res.result, 'ok');
      scope.done();
    });
  });
});

describe('block namespace', function () {

  it('getblockreward defaults blockno to 0 when omitted', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'block' &&
        q.action === 'getblockreward' &&
        q.address === '0xabc' &&
        q.blockno === '0' &&
        q.apikey === 'KEY')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('KEY');
    return api.block.getblockreward('0xabc').then(res => {
      assert.equal(res.result, 'ok');
      scope.done();
    });
  });

  it('getblockreward with a passed blockno', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'block' &&
        q.action === 'getblockreward' &&
        q.address === '0xabc' &&
        q.blockno === '12345' &&
        q.apikey === 'KEY')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('KEY');
    return api.block.getblockreward('0xabc', '12345').then(res => {
      assert.equal(res.result, 'ok');
      scope.done();
    });
  });
});

describe('transaction namespace', function () {

  it('getstatus', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'transaction' &&
        q.action === 'getstatus' &&
        q.txhash === '0xdeadbeef' &&
        q.apikey === 'KEY')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('KEY');
    return api.transaction.getstatus('0xdeadbeef').then(res => {
      assert.equal(res.result, 'ok');
      scope.done();
    });
  });
});

describe('contract namespace', function () {

  it('getabi', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'contract' &&
        q.action === 'getabi' &&
        q.address === '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413' &&
        q.apikey === 'KEY')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('KEY');
    return api.contract
      .getabi('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413')
      .then(res => {
        assert.equal(res.result, 'ok');
        scope.done();
      });
  });

  it('getsourcecode', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'contract' &&
        q.action === 'getsourcecode' &&
        q.address === '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413' &&
        q.apikey === 'KEY')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('KEY');
    return api.contract
      .getsourcecode('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413')
      .then(res => {
        assert.equal(res.result, 'ok');
        scope.done();
      });
  });
});

describe('log namespace', function () {

  it('getLogs includes only the provided optional params', function () {
    const scope = nock(HOST)
      .get('/v2/api')
      .query(q =>
        q.module === 'logs' &&
        q.action === 'getLogs' &&
        q.address === '0x33990122638b9132ca29c723bdf037f1c891a925' &&
        q.fromBlock === '379224' &&
        q.toBlock === '400000' &&
        q.topic0 === '0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545' &&
        // absent topics / operators must NOT appear in the query
        q.topic1 === undefined &&
        q.topic2 === undefined &&
        q.topic3 === undefined &&
        q.topic0_1_opr === undefined &&
        q.topic1_2_opr === undefined &&
        q.topic2_3_opr === undefined &&
        q.topic0_2_opr === undefined &&
        q.apikey === 'KEY')
      .reply(200, { status: '1', result: 'ok' });

    const api = init('KEY');
    return api.log
      .getLogs(
        '0x33990122638b9132ca29c723bdf037f1c891a925',
        '379224',
        '400000',
        '0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545'
      )
      .then(res => {
        assert.equal(res.result, 'ok');
        scope.done();
      });
  });
});
