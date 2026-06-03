'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { mockApi, queryOf } = require('./helpers');

describe('stats namespace', function () {

  it('tokensupply by tokenname only', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.stats.tokensupply('DGD');
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'stats');
    assert.equal(q.get('action'), 'tokensupply');
    assert.equal(q.get('tokenname'), 'DGD');
    assert.equal(q.get('contractaddress'), null);
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('tokensupply by contractaddress only', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.stats.tokensupply(
      null,
      '0x57d90b64a1a57749b0f932f1a3395792e12e7055'
    );
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'stats');
    assert.equal(q.get('action'), 'tokensupply');
    assert.equal(q.get('contractaddress'), '0x57d90b64a1a57749b0f932f1a3395792e12e7055');
    assert.equal(q.get('tokenname'), null);
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('ethsupply', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.stats.ethsupply();
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'stats');
    assert.equal(q.get('action'), 'ethsupply');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('ethprice', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.stats.ethprice();
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'stats');
    assert.equal(q.get('action'), 'ethprice');
    assert.equal(q.get('apikey'), 'KEY');
  });
});

describe('block namespace', function () {

  it('getblockreward defaults blockno to 0 when omitted', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.block.getblockreward('0xabc');
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'block');
    assert.equal(q.get('action'), 'getblockreward');
    assert.equal(q.get('address'), '0xabc');
    assert.equal(q.get('blockno'), '0');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('getblockreward with a passed blockno', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.block.getblockreward('0xabc', '12345');
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'block');
    assert.equal(q.get('action'), 'getblockreward');
    assert.equal(q.get('address'), '0xabc');
    assert.equal(q.get('blockno'), '12345');
    assert.equal(q.get('apikey'), 'KEY');
  });
});

describe('transaction namespace', function () {

  it('getstatus', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.transaction.getstatus('0xdeadbeef');
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'transaction');
    assert.equal(q.get('action'), 'getstatus');
    assert.equal(q.get('txhash'), '0xdeadbeef');
    assert.equal(q.get('apikey'), 'KEY');
  });
});

describe('contract namespace', function () {

  it('getabi', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.contract.getabi('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413');
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'contract');
    assert.equal(q.get('action'), 'getabi');
    assert.equal(q.get('address'), '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('getsourcecode', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.contract.getsourcecode('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413');
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'contract');
    assert.equal(q.get('action'), 'getsourcecode');
    assert.equal(q.get('address'), '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413');
    assert.equal(q.get('apikey'), 'KEY');
  });
});

describe('log namespace', function () {

  it('getLogs includes only the provided optional params', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.log.getLogs(
      '0x33990122638b9132ca29c723bdf037f1c891a925',
      '379224',
      '400000',
      '0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545'
    );
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'logs');
    assert.equal(q.get('action'), 'getLogs');
    assert.equal(q.get('address'), '0x33990122638b9132ca29c723bdf037f1c891a925');
    assert.equal(q.get('fromBlock'), '379224');
    assert.equal(q.get('toBlock'), '400000');
    assert.equal(q.get('topic0'), '0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545');

    // absent topics / operators must NOT appear in the query
    assert.equal(q.get('topic1'), null);
    assert.equal(q.get('topic2'), null);
    assert.equal(q.get('topic3'), null);
    assert.equal(q.get('topic0_1_opr'), null);
    assert.equal(q.get('topic1_2_opr'), null);
    assert.equal(q.get('topic2_3_opr'), null);
    assert.equal(q.get('topic0_2_opr'), null);
    assert.equal(q.get('apikey'), 'KEY');
  });
});
