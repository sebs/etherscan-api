import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { EtherscanArgumentError } from '../../lib/index.js';
import { mockApi, queryOf } from '../helpers.js';

const CONTRACT = '0x57d90b64a1a57749b0f932f1a3395792e12e7055';

describe('stats.tokensupply', function () {

  // Etherscan V2 no longer looks a token up by name: a tokenname-only call
  // fails live with "Missing or invalid parameter".
  it('rejects a token name without a contract address, without calling the API', async function () {
    const mocked = mockApi({ status: '1', result: '1' });
    await assert.rejects(
      () => mocked.api.stats.tokensupply('DGD'),
      (err) => err instanceof EtherscanArgumentError && err.argument === 'contractaddress',
    );
    assert.equal(mocked.transport.mock.callCount(), 0);
  });

  it('does not send a token name given alongside the contract address', async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    await mocked.api.stats.tokensupply('DGD', CONTRACT);
    assert.equal(queryOf(mocked.transport).get('tokenname'), null);
    assert.equal(queryOf(mocked.transport).get('contractaddress'), CONTRACT);
  });

  describe('by contractaddress only', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.stats.tokensupply(null, CONTRACT);
      result = res.result;
    });

    it('resolves with the API result', function () {
      assert.equal(result, 'ok');
    });

    it('targets the stats module', function () {
      assert.equal(queryOf(transport).get('module'), 'stats');
    });

    it('uses the tokensupply action', function () {
      assert.equal(queryOf(transport).get('action'), 'tokensupply');
    });

    it('sends the requested contractaddress', function () {
      assert.equal(queryOf(transport).get('contractaddress'), CONTRACT);
    });

    it('omits the tokenname param', function () {
      assert.equal(queryOf(transport).get('tokenname'), null);
    });

    it('sends the api key', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
  });

  it('rejects a call without a contract address, without calling the API', async function () {
    const mocked = mockApi({ status: '1', result: '1' });
    await assert.rejects(() => mocked.api.stats.tokensupply(), /needs the token contract address/);
    assert.equal(mocked.transport.mock.callCount(), 0);
  });
});
