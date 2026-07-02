import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const START = '2019-02-01';
const END = '2019-02-28';

describe('stats.chainsize', function () {

  describe('with clienttype/syncmode/sort defaults', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: [] });
      transport = mocked.transport;
      const res = await mocked.api.stats.chainsize(START, END);
      result = res.result;
    });

    it('resolves with an array result', function () {
      assert.ok(Array.isArray(result));
    });

    it('targets the stats module', function () {
      assert.equal(queryOf(transport).get('module'), 'stats');
    });

    it('uses the chainsize action', function () {
      assert.equal(queryOf(transport).get('action'), 'chainsize');
    });

    it('sends the requested startdate', function () {
      assert.equal(queryOf(transport).get('startdate'), START);
    });

    it('sends the requested enddate', function () {
      assert.equal(queryOf(transport).get('enddate'), END);
    });

    it('defaults clienttype to geth', function () {
      assert.equal(queryOf(transport).get('clienttype'), 'geth');
    });

    it('defaults syncmode to default', function () {
      assert.equal(queryOf(transport).get('syncmode'), 'default');
    });

    it('defaults sort to asc', function () {
      assert.equal(queryOf(transport).get('sort'), 'asc');
    });

    it('sends the api key', function () {
      assert.equal(queryOf(transport).get('apikey'), 'KEY');
    });
  });

  describe('with explicit clienttype/syncmode/sort', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: [] });
      transport = mocked.transport;
      await mocked.api.stats.chainsize(START, END, 'parity', 'archive', 'desc');
    });

    it('passes through the explicit clienttype', function () {
      assert.equal(queryOf(transport).get('clienttype'), 'parity');
    });

    it('passes through the explicit syncmode', function () {
      assert.equal(queryOf(transport).get('syncmode'), 'archive');
    });

    it('passes through the explicit sort', function () {
      assert.equal(queryOf(transport).get('sort'), 'desc');
    });
  });
});
