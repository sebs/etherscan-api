import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EtherscanError, EtherscanHttpError, EtherscanArgumentError } from '../lib/index.js';
import { mockApi } from './helpers.js';

// Etherscan reports a rate limit as an HTTP 200 with status "0" (checked live:
// "Max calls per sec rate limit reached (3/sec)"), or, behind some proxies, as
// a non-2xx status. `rateLimited` lets a caller back off without matching text.
describe('EtherscanError.rateLimited', function () {
  async function errorFor(body) {
    const { api } = mockApi(body);
    return api.account.balance('0x' + 'a'.repeat(40)).then(
      () => assert.fail('expected a rejection'),
      (err) => err,
    );
  }

  it('is true for the per-second limit', async function () {
    const err = await errorFor({ status: '0', message: 'NOTOK', result: 'Max calls per sec rate limit reached (3/sec)' });
    assert.equal(err.rateLimited, true);
  });

  it('is true for the daily limit', async function () {
    const err = await errorFor({ status: '0', message: 'NOTOK', result: 'Max daily rate limit reached. 100000 (100%) of 100000 used.' });
    assert.equal(err.rateLimited, true);
  });

  it('is false for any other failure', async function () {
    const err = await errorFor({ status: '0', message: 'NOTOK', result: 'Invalid API Key (#err2)' });
    assert.equal(err.rateLimited, false);
  });

  it('is true for an HTTP 429', function () {
    assert.equal(new EtherscanHttpError('Request failed with status code 429', 429).rateLimited, true);
  });

  it('is true for a non-2xx response carrying the rate-limit message', function () {
    const err = new EtherscanHttpError('Request failed with status code 403: Max rate limit reached', 403);
    assert.equal(err.rateLimited, true);
  });

  it('is false for another HTTP failure', function () {
    assert.equal(new EtherscanHttpError('Request failed with status code 500', 500).rateLimited, false);
  });

  it('is false for an argument error', function () {
    assert.equal(new EtherscanArgumentError('Invalid sort "x"', 'sort').rateLimited, false);
  });

  it('is available on the base class', function () {
    assert.equal(new EtherscanError('Max rate limit reached').rateLimited, true);
  });
});
