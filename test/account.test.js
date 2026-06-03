import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from './helpers.js';

describe('account namespace', function () {

  describe('tokenbalance', function () {
    it('builds the tokenbalance request', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.tokenbalance(
        '0x4366ddc115d8cf213c564da36e64c8ebaa30cdbd',
        '',
        '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a'
      );
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'tokenbalance');
      assert.equal(q.get('tag'), 'latest');
      assert.equal(q.get('address'), '0x4366ddc115d8cf213c564da36e64c8ebaa30cdbd');
      assert.equal(q.get('contractaddress'), '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a');
    });
  });

  describe('balance', function () {
    it('uses action "balance" for a single address', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'balance');
      assert.equal(q.get('tag'), 'latest');
      assert.equal(q.get('address'), '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
    });

    it('uses action "balancemulti" with comma-joined addresses for an array', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.balance(['0xaaa', '0xbbb']);
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'balancemulti');
      assert.equal(q.get('tag'), 'latest');
      assert.equal(q.get('address'), '0xaaa,0xbbb');
    });
  });

  describe('txlistinternal', function () {
    it('builds the request by txhash', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.txlistinternal(
        '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170'
      );
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'txlistinternal');
      assert.equal(q.get('sort'), 'asc');
      assert.equal(q.get('txhash'), '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170');
      assert.equal(q.get('address'), null);
      assert.equal(q.get('startblock'), null);
      assert.equal(q.get('endblock'), null);
    });

    it('builds the request by address with default startblock/endblock/sort', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.txlistinternal(
        null,
        '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
      );
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'txlistinternal');
      assert.equal(q.get('sort'), 'asc');
      assert.equal(q.get('address'), '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      assert.equal(q.get('startblock'), '0');
      assert.equal(q.get('endblock'), 'latest');
      assert.equal(q.get('txhash'), null);
    });
  });

  describe('txlist', function () {
    it('applies defaults (page=1, offset=100, sort=asc, startblock=0, endblock=latest)', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'txlist');
      assert.equal(q.get('address'), '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      assert.equal(q.get('startblock'), '0');
      assert.equal(q.get('endblock'), 'latest');
      assert.equal(q.get('page'), '1');
      assert.equal(q.get('offset'), '100');
      assert.equal(q.get('sort'), 'asc');
    });

    it('passes through explicit params', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.txlist('0xabc', 5, 99, 2, 50, 'desc');
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'txlist');
      assert.equal(q.get('address'), '0xabc');
      assert.equal(q.get('startblock'), '5');
      assert.equal(q.get('endblock'), '99');
      assert.equal(q.get('page'), '2');
      assert.equal(q.get('offset'), '50');
      assert.equal(q.get('sort'), 'desc');
    });
  });

  describe('getminedblocks', function () {
    it('builds the getminedblocks request', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b');
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'getminedblocks');
      assert.equal(q.get('address'), '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b');
    });
  });

  describe('tokentx', function () {
    it('builds the request with a contractaddress and defaults', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.tokentx(
        '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
        '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da'
      );
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'tokentx');
      assert.equal(q.get('address'), '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      assert.equal(q.get('contractaddress'), '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da');
      assert.equal(q.get('startblock'), '0');
      assert.equal(q.get('endblock'), 'latest');
      assert.equal(q.get('page'), '1');
      assert.equal(q.get('offset'), '100');
      assert.equal(q.get('sort'), 'asc');
    });

    it('omits contractaddress when not supplied', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.tokentx('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'tokentx');
      assert.equal(q.get('address'), '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      assert.equal(q.get('contractaddress'), null);
      assert.equal(q.get('startblock'), '0');
      assert.equal(q.get('endblock'), 'latest');
      assert.equal(q.get('page'), '1');
      assert.equal(q.get('offset'), '100');
      assert.equal(q.get('sort'), 'asc');
    });
  });

  describe('tokennfttx', function () {
    it('builds the request with a contractaddress and defaults', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.tokennfttx(
        '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
        '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da'
      );
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'tokennfttx');
      assert.equal(q.get('address'), '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      assert.equal(q.get('contractaddress'), '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da');
      assert.equal(q.get('startblock'), '0');
      assert.equal(q.get('endblock'), 'latest');
      assert.equal(q.get('page'), '1');
      assert.equal(q.get('offset'), '100');
      assert.equal(q.get('sort'), 'asc');
    });

    it('omits contractaddress when not supplied', async function () {
      const { api, transport } = mockApi({ status: '1', result: 'ok' });

      const res = await api.account.tokennfttx('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      assert.equal(res.result, 'ok');

      const q = queryOf(transport);
      assert.equal(q.get('apikey'), 'KEY');
      assert.equal(q.get('module'), 'account');
      assert.equal(q.get('action'), 'tokennfttx');
      assert.equal(q.get('address'), '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
      assert.equal(q.get('contractaddress'), null);
      assert.equal(q.get('startblock'), '0');
      assert.equal(q.get('endblock'), 'latest');
      assert.equal(q.get('page'), '1');
      assert.equal(q.get('offset'), '100');
      assert.equal(q.get('sort'), 'asc');
    });
  });
});
