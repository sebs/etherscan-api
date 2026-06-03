'use strict';
const assert = require('chai').assert;
const nock = require('nock');
const { init } = require('..');

const HOST = 'https://api.etherscan.io';

describe('account namespace', function () {

  describe('tokenbalance', function () {
    it('builds the tokenbalance request', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'tokenbalance' &&
          q.tag === 'latest' &&
          q.address === '0x4366ddc115d8cf213c564da36e64c8ebaa30cdbd' &&
          q.contractaddress === '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a')
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .tokenbalance(
          '0x4366ddc115d8cf213c564da36e64c8ebaa30cdbd',
          '',
          '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a'
        )
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });
  });

  describe('balance', function () {
    it('uses action "balance" for a single address', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'balance' &&
          q.tag === 'latest' &&
          q.address === '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });

    it('uses action "balancemulti" with comma-joined addresses for an array', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'balancemulti' &&
          q.tag === 'latest' &&
          q.address === '0xaaa,0xbbb')
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .balance(['0xaaa', '0xbbb'])
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });
  });

  describe('txlistinternal', function () {
    it('builds the request by txhash', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'txlistinternal' &&
          q.sort === 'asc' &&
          q.txhash === '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170' &&
          q.address === undefined &&
          q.startblock === undefined &&
          q.endblock === undefined)
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .txlistinternal('0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170')
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });

    it('builds the request by address with default startblock/endblock/sort', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'txlistinternal' &&
          q.sort === 'asc' &&
          q.address === '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae' &&
          q.startblock === '0' &&
          q.endblock === 'latest' &&
          q.txhash === undefined)
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .txlistinternal(null, '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });
  });

  describe('txlist', function () {
    it('applies defaults (page=1, offset=100, sort=asc, startblock=0, endblock=latest)', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'txlist' &&
          q.address === '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae' &&
          q.startblock === '0' &&
          q.endblock === 'latest' &&
          q.page === '1' &&
          q.offset === '100' &&
          q.sort === 'asc')
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });

    it('passes through explicit params', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'txlist' &&
          q.address === '0xabc' &&
          q.startblock === '5' &&
          q.endblock === '99' &&
          q.page === '2' &&
          q.offset === '50' &&
          q.sort === 'desc')
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .txlist('0xabc', 5, 99, 2, 50, 'desc')
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });
  });

  describe('getminedblocks', function () {
    it('builds the getminedblocks request', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'getminedblocks' &&
          q.address === '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b')
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b')
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });
  });

  describe('tokentx', function () {
    it('builds the request with a contractaddress and defaults', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'tokentx' &&
          q.address === '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae' &&
          q.contractaddress === '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da' &&
          q.startblock === '0' &&
          q.endblock === 'latest' &&
          q.page === '1' &&
          q.offset === '100' &&
          q.sort === 'asc')
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .tokentx(
          '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
          '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da'
        )
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });

    it('omits contractaddress when not supplied', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'tokentx' &&
          q.address === '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae' &&
          q.contractaddress === undefined &&
          q.startblock === '0' &&
          q.endblock === 'latest' &&
          q.page === '1' &&
          q.offset === '100' &&
          q.sort === 'asc')
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .tokentx('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });
  });

  describe('tokennfttx', function () {
    it('builds the request with a contractaddress and defaults', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'tokennfttx' &&
          q.address === '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae' &&
          q.contractaddress === '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da' &&
          q.startblock === '0' &&
          q.endblock === 'latest' &&
          q.page === '1' &&
          q.offset === '100' &&
          q.sort === 'asc')
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .tokennfttx(
          '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
          '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da'
        )
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });

    it('omits contractaddress when not supplied', function () {
      const scope = nock(HOST)
        .get('/v2/api')
        .query(q =>
          q.apikey === 'KEY' &&
          q.module === 'account' &&
          q.action === 'tokennfttx' &&
          q.address === '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae' &&
          q.contractaddress === undefined &&
          q.startblock === '0' &&
          q.endblock === 'latest' &&
          q.page === '1' &&
          q.offset === '100' &&
          q.sort === 'asc')
        .reply(200, { status: '1', result: 'ok' });

      const api = init('KEY');
      return api.account
        .tokennfttx('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')
        .then(res => {
          assert.equal(res.result, 'ok');
          scope.done();
        });
    });
  });
});
