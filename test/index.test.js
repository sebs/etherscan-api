import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as pkg from '../lib/index.js';

describe('index exports', function () {

  it('exposes init as a function', function () {
    assert.equal(typeof pkg.init, 'function');
  });

  it('exposes resolveChainId as a function', function () {
    assert.equal(typeof pkg.resolveChainId, 'function');
  });

  it('resolves the mainnet chain id to 1', function () {
    assert.equal(pkg.resolveChainId('mainnet'), 1);
  });

  it('exposes the EtherscanError class as a function', function () {
    assert.equal(typeof pkg.EtherscanError, 'function');
  });

  it('exposes the EtherscanArgumentError class as a function', function () {
    assert.equal(typeof pkg.EtherscanArgumentError, 'function');
  });

  // Every argument check throws the same class, naming the argument, and it is
  // an EtherscanError so one instanceof check covers every library error.
  describe('argument errors', function () {
    const CASES = [
      ['chain', () => pkg.init('KEY', 'notachain')],
      ['chainid', () => pkg.init('KEY', 0)],
      ['timeout', () => pkg.init('KEY', null, -1)],
      ['apiKey', () => pkg.init('')],
      ['request', () => pkg.init('KEY', null, null, 'nope')],
    ];
    for (const [argument, call] of CASES) {
      it('an invalid ' + argument + ' throws an EtherscanArgumentError naming it', function () {
        assert.throws(call, (err) =>
          err instanceof pkg.EtherscanArgumentError && err instanceof pkg.EtherscanError && err.argument === argument);
      });
    }

    it('rejects a call-level argument the same way (sort)', async function () {
      const api = pkg.init('KEY', null, null, async () => ({ status: '1', result: [] }));
      await assert.rejects(() => api.account.txlist('0xa', 0, 'latest', 1, 10, 'DESC'), (err) =>
        err instanceof pkg.EtherscanArgumentError && err.argument === 'sort' && err.value === 'DESC');
    });

    it('never puts a rejected API key value on the error', function () {
      assert.throws(() => pkg.init({ secret: 'KEY' }), (err) => err.value === undefined && !/KEY/.test(err.message));
    });
  });

  it('exposes the EtherscanHttpError class as a function', function () {
    assert.equal(typeof pkg.EtherscanHttpError, 'function');
  });

  // Exported so callers can wrap the default transport and reach the options
  // the library itself never passes (maxResponseBytes, allowInsecure).
  it('exposes httpTransport as a function', function () {
    assert.equal(typeof pkg.httpTransport, 'function');
  });

  describe('init namespaces', function () {
    let api;

    beforeEach(function () {
      api = pkg.init('KEY');
    });

    ['log', 'proxy', 'stats', 'block', 'transaction', 'contract', 'account', 'gastracker', 'usage']
      .forEach(function (ns) {
        it('exposes the ' + ns + ' namespace', function () {
          assert.ok(ns in api);
        });
      });
  });

  it('init works with only an API key (defaults)', function () {
    assert.ok(pkg.init('KEY'));
  });

  for (const key of [12345, {}, true]) {
    it('init names the type of a non-string API key (' + typeof key + ')', function () {
      assert.throws(function () { return pkg.init(key); }, new RegExp('Invalid API key: expected a string, got ' + typeof key));
    });
  }

  it('init trims whitespace around the API key (e.g. a trailing newline from a file)', async function () {
    let url;
    const api = pkg.init('  KEY\n', null, null, async (u) => { url = u; return { status: '1', result: 'x' }; });
    await api.stats.ethsupply();
    assert.equal(new URL(url).searchParams.get('apikey'), 'KEY');
  });

  for (const key of [undefined, null, '', '   ', '\n']) {
    it('init throws for a missing API key (' + JSON.stringify(key) + ')', function () {
      assert.throws(function () { return pkg.init(key); }, /API key is required/);
    });
  }

  it('pickChainUrl throws a removed-in-v11 pointer error', function () {
    assert.throws(function () { return pkg.pickChainUrl(); }, /removed in v11/);
  });

  for (const timeout of [0, -5, NaN, Infinity, 2 ** 31]) {
    it('init rejects the invalid timeout ' + String(timeout), function () {
      assert.throws(function () { return pkg.init('KEY', null, timeout); }, /Invalid timeout/);
    });
  }

  it('init accepts a numeric-string timeout (e.g. from process.env)', async function () {
    let options;
    const api = pkg.init('KEY', null, '5000', async (url, o) => { options = o; return { status: '1', result: 'x' }; });
    await api.stats.ethsupply();
    assert.equal(options.timeout, 5000);
  });

  it('init quotes a rejected string timeout', function () {
    assert.throws(function () { return pkg.init('KEY', null, 'soon'); }, /Invalid timeout "soon": expected a positive number/);
  });

  for (const request of ['nope', {}, 42]) {
    it('init rejects a non-function transport (' + typeof request + ')', function () {
      assert.throws(function () { return pkg.init('KEY', null, null, request); }, /Invalid request transport: expected a function/);
    });
  }

  it('init defaults a null timeout', function () {
    assert.ok(pkg.init('KEY', null, null));
  });

  it('init throws for a retired chain', function () {
    assert.throws(function () { return pkg.init('KEY', 'goerli'); }, /no longer supported/);
  });
});
