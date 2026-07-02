import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, bodyOf, optionsOf } from '../helpers.js';

for (const method of ['verifyvyper', 'verifystylus', 'verifyzksyncsourcecode']) {
  describe(`contract.${method}`, function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'g' });
      transport = mocked.transport;
      await mocked.api.contract[method]({
        contractaddress: '0xabc',
        sourceCode: 'src',
        contractname: 'C',
        runs: undefined,
      });
    });

    it('uses the POST method', function () {
      assert.equal(optionsOf(transport).method, 'POST');
    });

    it('targets the contract module', function () {
      assert.equal(bodyOf(transport).get('module'), 'contract');
    });

    it(`uses the ${method} action`, function () {
      assert.equal(bodyOf(transport).get('action'), method);
    });

    it('sends the contract address', function () {
      assert.equal(bodyOf(transport).get('contractaddress'), '0xabc');
    });

    it('sends the source code', function () {
      assert.equal(bodyOf(transport).get('sourceCode'), 'src');
    });

    it('sends the contract name', function () {
      assert.equal(bodyOf(transport).get('contractname'), 'C');
    });

    it('sends the api key', function () {
      assert.equal(bodyOf(transport).get('apikey'), 'KEY');
    });

    it('drops the undefined runs field', function () {
      assert.equal(bodyOf(transport).get('runs'), null);
    });
  });
}
