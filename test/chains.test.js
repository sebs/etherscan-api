'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { resolveChainId, CHAINS } = require('../lib/chains');

describe('chains.resolveChainId', function () {

  it('defaults to mainnet (1) for null/undefined/empty', function () {
    assert.equal(resolveChainId(null), 1);
    assert.equal(resolveChainId(undefined), 1);
    assert.equal(resolveChainId(''), 1);
  });

  it('maps known names to chainids', function () {
    assert.equal(resolveChainId('mainnet'), 1);
    assert.equal(resolveChainId('sepolia'), 11155111);
    assert.equal(resolveChainId('arbitrum'), 42161);
    assert.equal(resolveChainId('base'), 8453);
  });

  it('is case-insensitive', function () {
    assert.equal(resolveChainId('Sepolia'), 11155111);
    assert.equal(resolveChainId('BSC'), 56);
  });

  it('passes through a numeric chainid', function () {
    assert.equal(resolveChainId(42161), 42161);
    assert.equal(resolveChainId(999999), 999999);
  });

  it('passes through an all-digit string', function () {
    assert.equal(resolveChainId('137'), 137);
  });

  it('throws a helpful error for retired chains', function () {
    assert.throws(() => resolveChainId('goerli'), /no longer supported/);
    assert.throws(() => resolveChainId('goerli'), /Sepolia or Holesky/);
    assert.throws(() => resolveChainId('ropsten'), /no longer supported/);
    assert.throws(() => resolveChainId('rinkeby'), /no longer supported/);
    assert.throws(() => resolveChainId('kovan'), /no longer supported/);
  });

  it('throws for unknown chains', function () {
    assert.throws(() => resolveChainId('notachain'), /Unknown chain/);
  });

  it('exposes the curated map', function () {
    assert.equal(CHAINS.mainnet, 1);
  });
});
