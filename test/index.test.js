'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const pkg = require('..');

describe('index exports', function () {

  it('can be required', function () {
    require('..');
  });

  it('exposes init', function () {
    assert.equal(typeof pkg.init, 'function');
  });

  it('exposes resolveChainId', function () {
    assert.equal(typeof pkg.resolveChainId, 'function');
    assert.equal(pkg.resolveChainId('mainnet'), 1);
  });

  it('init returns the expected namespaces', function () {
    const api = pkg.init('KEY');
    ['log', 'proxy', 'stats', 'block', 'transaction', 'contract', 'account']
      .forEach(ns => assert.ok(ns in api));
  });

  it('init works with no arguments (defaults)', function () {
    assert.ok(pkg.init());
  });

  it('pickChainUrl throws a removed-in-v11 pointer error', function () {
    assert.throws(() => pkg.pickChainUrl(), /removed in v11/);
  });

  it('init throws for a retired chain', function () {
    assert.throws(() => pkg.init('KEY', 'goerli'), /no longer supported/);
  });
});
