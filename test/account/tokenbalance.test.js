import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { EtherscanArgumentError } from '../../lib/index.js';
import { mockApi, queryOf } from '../helpers.js';

const ADDRESS = '0x4366ddc115d8cf213c564da36e64c8ebaa30cdbd';
const CONTRACT = '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a';

describe('account.tokenbalance', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    transport = mocked.transport;
    const res = await mocked.api.account.tokenbalance(ADDRESS, '', CONTRACT);
    result = res.result;
  });

  it('resolves with the API result', function () {
    assert.equal(result, 'ok');
  });

  it('sends the apikey', function () {
    assert.equal(queryOf(transport).get('apikey'), 'KEY');
  });

  it('targets the account module', function () {
    assert.equal(queryOf(transport).get('module'), 'account');
  });

  it('uses the tokenbalance action', function () {
    assert.equal(queryOf(transport).get('action'), 'tokenbalance');
  });

  it('defaults the tag to latest', function () {
    assert.equal(queryOf(transport).get('tag'), 'latest');
  });

  it('sends the requested address', function () {
    assert.equal(queryOf(transport).get('address'), ADDRESS);
  });

  it('sends the contract address', function () {
    assert.equal(queryOf(transport).get('contractaddress'), CONTRACT);
  });

  // Etherscan V2 needs the contract address; a token name alone fails live
  // with "Invalid contractAddress format".
  for (const [name, args] of [['a token name only', [ADDRESS, 'USDT']], ['no token at all', [ADDRESS]]]) {
    it('rejects ' + name + ', without calling the API', async function () {
      const mocked = mockApi({ status: '1', result: 'ok' });
      await assert.rejects(
        () => mocked.api.account.tokenbalance(...args),
        (err) => err instanceof EtherscanArgumentError && err.argument === 'contractaddress',
      );
      assert.equal(mocked.transport.mock.callCount(), 0);
    });
  }

  it('does not send a token name given alongside the contract address', async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    await mocked.api.account.tokenbalance(ADDRESS, 'USDT', CONTRACT);
    assert.equal(queryOf(mocked.transport).get('tokenname'), null);
  });
});
