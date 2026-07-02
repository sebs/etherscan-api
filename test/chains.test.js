import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveChainId, CHAINS } from '../lib/chains.js';

describe('chains.resolveChainId', function () {

  const DEFAULTS = [null, undefined, ''];
  for (const input of DEFAULTS) {
    it('defaults to mainnet (1) for ' + JSON.stringify(input), function () {
      assert.equal(resolveChainId(input), 1);
    });
  }

  const KNOWN_NAMES = [
    ['mainnet', 1],
    ['sepolia', 11155111],
    ['arbitrum', 42161],
    ['base', 8453],
  ];
  for (const [input, expected] of KNOWN_NAMES) {
    it('maps ' + input + ' to ' + expected, function () {
      assert.equal(resolveChainId(input), expected);
    });
  }

  const CASE_INSENSITIVE = [
    ['Sepolia', 11155111],
    ['BSC', 56],
  ];
  for (const [input, expected] of CASE_INSENSITIVE) {
    it('is case-insensitive for ' + input, function () {
      assert.equal(resolveChainId(input), expected);
    });
  }

  const NUMERIC = [
    [42161, 42161],
    [999999, 999999],
  ];
  for (const [input, expected] of NUMERIC) {
    it('passes through numeric chainid ' + input, function () {
      assert.equal(resolveChainId(input), expected);
    });
  }

  it('passes through an all-digit string', function () {
    assert.equal(resolveChainId('137'), 137);
  });

  const RETIRED = ['goerli', 'ropsten', 'rinkeby', 'kovan'];
  for (const input of RETIRED) {
    it('throws "no longer supported" for retired chain ' + input, function () {
      assert.throws(() => resolveChainId(input), /no longer supported/);
    });
  }

  it('suggests Sepolia or Holesky for goerli', function () {
    assert.throws(() => resolveChainId('goerli'), /Sepolia or Holesky/);
  });

  it('throws for unknown chains', function () {
    assert.throws(() => resolveChainId('notachain'), /Unknown chain/);
  });

  it('exposes the curated map', function () {
    assert.equal(CHAINS.mainnet, 1);
  });
});
