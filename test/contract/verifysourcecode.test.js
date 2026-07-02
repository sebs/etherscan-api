import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, bodyOf, optionsOf } from '../helpers.js';

describe('contract.verifysourcecode', function () {

  describe('POSTs the fields as a form body', function () {
    let transport;
    let result;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'myguid' });
      transport = mocked.transport;
      const res = await mocked.api.contract.verifysourcecode({
        contractaddress: '0xabc',
        sourceCode: 'contract C {}',
        contractname: 'C',
        compilerversion: 'v0.8.24+commit.e11b9ed9',
        codeformat: 'solidity-single-file',
        optimizationUsed: 1,
      });
      result = res.result;
    });

    it('resolves with the API result', function () {
      assert.equal(result, 'myguid');
    });

    it('uses the POST method', function () {
      assert.equal(optionsOf(transport).method, 'POST');
    });

    it('targets the contract module', function () {
      assert.equal(bodyOf(transport).get('module'), 'contract');
    });

    it('uses the verifysourcecode action', function () {
      assert.equal(bodyOf(transport).get('action'), 'verifysourcecode');
    });

    it('sends the api key', function () {
      assert.equal(bodyOf(transport).get('apikey'), 'KEY');
    });

    it('sends the chain id', function () {
      assert.equal(bodyOf(transport).get('chainid'), '1');
    });

    it('sends the contract address', function () {
      assert.equal(bodyOf(transport).get('contractaddress'), '0xabc');
    });

    it('sends the source code', function () {
      assert.equal(bodyOf(transport).get('sourceCode'), 'contract C {}');
    });

    it('sends the contract name', function () {
      assert.equal(bodyOf(transport).get('contractname'), 'C');
    });

    it('sends the compiler version', function () {
      assert.equal(bodyOf(transport).get('compilerversion'), 'v0.8.24+commit.e11b9ed9');
    });

    it('sends the optimizationUsed flag', function () {
      assert.equal(bodyOf(transport).get('optimizationUsed'), '1');
    });
  });

  describe('drops undefined optional fields', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: 'g' });
      transport = mocked.transport;
      await mocked.api.contract.verifysourcecode({
        contractaddress: '0xabc',
        sourceCode: 'x',
        contractname: 'C',
        compilerversion: 'v0.8.24',
      });
    });

    it('omits the runs field', function () {
      assert.equal(bodyOf(transport).get('runs'), null);
    });

    it('omits the constructorArguements field', function () {
      assert.equal(bodyOf(transport).get('constructorArguements'), null);
    });
  });
});
