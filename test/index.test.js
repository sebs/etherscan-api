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

  it('init works with no arguments (defaults)', function () {
    assert.ok(pkg.init());
  });

  it('pickChainUrl throws a removed-in-v11 pointer error', function () {
    assert.throws(function () { return pkg.pickChainUrl(); }, /removed in v11/);
  });

  it('init throws for a retired chain', function () {
    assert.throws(function () { return pkg.init('KEY', 'goerli'); }, /no longer supported/);
  });
});
