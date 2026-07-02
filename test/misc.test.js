import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf, bodyOf, optionsOf } from './helpers.js';

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

  it('ethsupply2', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.stats.ethsupply2();
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'stats');
    assert.equal(q.get('action'), 'ethsupply2');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('nodecount', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.stats.nodecount();
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'stats');
    assert.equal(q.get('action'), 'nodecount');
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

  it('getblockcountdown', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.block.getblockcountdown('16701588');
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'block');
    assert.equal(q.get('action'), 'getblockcountdown');
    assert.equal(q.get('blockno'), '16701588');
  });

  it('getblocknobytime defaults closest to "before"', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.block.getblocknobytime('1578638524');
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'block');
    assert.equal(q.get('action'), 'getblocknobytime');
    assert.equal(q.get('timestamp'), '1578638524');
    assert.equal(q.get('closest'), 'before');
  });

  it('getblocknobytime accepts closest="after"', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    await api.block.getblocknobytime('1578638524', 'after');
    assert.equal(queryOf(transport).get('closest'), 'after');
  });

  it('getblocktxnscount sends the block number', async function () {
    const { api, transport } = mockApi({
      status: '1',
      result: { block: 24884529, txsCount: 87, internalTxsCount: 55, erc20TxsCount: 103, erc721TxsCount: 1, erc1155TxsCount: 0 },
    });

    const res = await api.block.getblocktxnscount('24884529');
    assert.equal(res.result.txsCount, 87);

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'block');
    assert.equal(q.get('action'), 'getblocktxnscount');
    assert.equal(q.get('blockno'), '24884529');
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

  it('gettxreceiptstatus', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.transaction.gettxreceiptstatus('0xdeadbeef');
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'transaction');
    assert.equal(q.get('action'), 'gettxreceiptstatus');
    assert.equal(q.get('txhash'), '0xdeadbeef');
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

  it('getcontractcreation with a single address', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.contract.getcontractcreation('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413');
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'contract');
    assert.equal(q.get('action'), 'getcontractcreation');
    assert.equal(q.get('contractaddresses'), '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413');
  });

  it('getcontractcreation joins an array of addresses', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    await api.contract.getcontractcreation(['0xaaa', '0xbbb']);
    assert.equal(queryOf(transport).get('contractaddresses'), '0xaaa,0xbbb');
  });

  it('verifysourcecode POSTs the fields as a form body', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'myguid' });

    const res = await api.contract.verifysourcecode({
      contractaddress: '0xabc',
      sourceCode: 'contract C {}',
      contractname: 'C',
      compilerversion: 'v0.8.24+commit.e11b9ed9',
      codeformat: 'solidity-single-file',
      optimizationUsed: 1,
    });
    assert.equal(res.result, 'myguid');

    assert.equal(optionsOf(transport).method, 'POST');
    const b = bodyOf(transport);
    assert.equal(b.get('module'), 'contract');
    assert.equal(b.get('action'), 'verifysourcecode');
    assert.equal(b.get('apikey'), 'KEY');
    assert.equal(b.get('chainid'), '1');
    assert.equal(b.get('contractaddress'), '0xabc');
    assert.equal(b.get('sourceCode'), 'contract C {}');
    assert.equal(b.get('contractname'), 'C');
    assert.equal(b.get('compilerversion'), 'v0.8.24+commit.e11b9ed9');
    assert.equal(b.get('optimizationUsed'), '1');
  });

  it('verifysourcecode drops undefined optional fields', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'g' });

    await api.contract.verifysourcecode({
      contractaddress: '0xabc',
      sourceCode: 'x',
      contractname: 'C',
      compilerversion: 'v0.8.24',
    });
    const b = bodyOf(transport);
    assert.equal(b.get('runs'), null);
    assert.equal(b.get('constructorArguements'), null);
  });

  it('verifyproxycontract POSTs the address', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'g' });

    await api.contract.verifyproxycontract('0xproxy', '0ximpl');
    assert.equal(optionsOf(transport).method, 'POST');
    const b = bodyOf(transport);
    assert.equal(b.get('action'), 'verifyproxycontract');
    assert.equal(b.get('address'), '0xproxy');
    assert.equal(b.get('expectedimplementation'), '0ximpl');
  });

  it('checkverifystatus is a GET with the guid', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'Pass - Verified' });

    await api.contract.checkverifystatus('myguid');
    assert.notEqual(optionsOf(transport).method, 'POST');
    const q = queryOf(transport);
    assert.equal(q.get('action'), 'checkverifystatus');
    assert.equal(q.get('guid'), 'myguid');
  });

  it('checkproxyverification is a GET with the guid', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    await api.contract.checkproxyverification('myguid');
    const q = queryOf(transport);
    assert.equal(q.get('action'), 'checkproxyverification');
    assert.equal(q.get('guid'), 'myguid');
  });

  for (const method of ['verifyvyper', 'verifystylus', 'verifyzksyncsourcecode']) {
    it(`${method} POSTs the verification fields`, async function () {
      const { api, transport } = mockApi({ status: '1', result: 'g' });

      await api.contract[method]({
        contractaddress: '0xabc',
        sourceCode: 'src',
        contractname: 'C',
        runs: undefined,
      });

      assert.equal(optionsOf(transport).method, 'POST');
      const b = bodyOf(transport);
      assert.equal(b.get('module'), 'contract');
      assert.equal(b.get('action'), method);
      assert.equal(b.get('contractaddress'), '0xabc');
      assert.equal(b.get('sourceCode'), 'src');
      assert.equal(b.get('contractname'), 'C');
      assert.equal(b.get('apikey'), 'KEY');
      assert.equal(b.get('runs'), null); // undefined dropped
    });
  }
});

describe('usage namespace', function () {

  it('getapilimit', async function () {
    const { api, transport } = mockApi({ status: '1', result: { limit: '100000', used: '1' } });

    const res = await api.usage.getapilimit();
    assert.ok(res.result);

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'getapilimit');
    assert.equal(q.get('action'), 'getapilimit');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('chainlist hits the dedicated /v2/chainlist path (GET, no api params)', async function () {
    const { api, transport } = mockApi({ result: [{ chainid: '1', chainname: 'Ethereum Mainnet' }] });

    const res = await api.usage.chainlist();
    assert.ok(Array.isArray(res.result));

    const url = transport.mock.calls[0].arguments[0];
    assert.ok(url.endsWith('/v2/chainlist'), `unexpected url: ${url}`);
    assert.ok(!url.includes('/v2/api'));
    assert.ok(!url.includes('apikey'));
    assert.notEqual(optionsOf(transport).method, 'POST');
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

  it('getLogs forwards page and offset when supplied', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    await api.log.getLogs(
      '0x33990122638b9132ca29c723bdf037f1c891a925',
      '379224', '400000',
      undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      2, 50
    );

    const q = queryOf(transport);
    assert.equal(q.get('page'), '2');
    assert.equal(q.get('offset'), '50');
  });
});
