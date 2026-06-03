'use strict';
const assert = require('chai').assert;
const pkg = require('..');

describe('index exports', function () {

  it('can be required', function () {
    require('..');
  });

  it('exposes init', function () {
    assert.isFunction(pkg.init);
  });

  it('exposes resolveChainId', function () {
    assert.isFunction(pkg.resolveChainId);
    assert.equal(pkg.resolveChainId('mainnet'), 1);
  });

  it('init returns the expected namespaces', function () {
    const api = pkg.init('KEY');
    ['log', 'proxy', 'stats', 'block', 'transaction', 'contract', 'account']
      .forEach(ns => assert.property(api, ns));
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
