import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const CONTRACT = '0x57d90b64a1a57749b0f932f1a3395792e12e7055';

describe('stats.tokensupply', function () {

  describe('by tokenname only', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      transport = mocked.transport;
      const res = await mocked.api.stats.tokensupply('DGD');
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

    it('sends the requested tokenname', function () {
      assert.equal(queryOf(transport).get('tokenname'), 'DGD');
    });

    it('omits the contractaddress param', function () {
      assert.equal(queryOf(transport).get('contractaddress'), null);
    });

    it('sends the api key', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
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
});
