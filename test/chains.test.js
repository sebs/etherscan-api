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
    ['hoodi', 560048],
    ['avalanche_fuji', 43113],
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

  const INVALID_NUMERIC = [NaN, Infinity, -Infinity, -1, 0, 1.5, 1e21];
  for (const input of INVALID_NUMERIC) {
    it('rejects the invalid chainid ' + String(input), function () {
      assert.throws(() => resolveChainId(input), /Invalid chainid/);
    });
  }

  const INVALID_NUMERIC_STRINGS = ['0', '-1'];
  for (const input of INVALID_NUMERIC_STRINGS) {
    it('rejects the invalid numeric string ' + JSON.stringify(input), function () {
      assert.throws(() => resolveChainId(input), /Invalid chainid|Unknown chain/);
    });
  }

  const NON_STRING = [true, {}, []];
  for (const input of NON_STRING) {
    it('throws a clear error, not a TypeError, for ' + JSON.stringify(input), function () {
      assert.throws(
        () => resolveChainId(input),
        (err) => err instanceof Error && !/toLowerCase/.test(err.message),
      );
    });
  }

  const RETIRED = ['goerli', 'ropsten', 'rinkeby', 'kovan', 'holesky'];
  for (const input of RETIRED) {
    it('throws "no longer supported" for retired chain ' + input, function () {
      assert.throws(() => resolveChainId(input), /no longer supported/);
    });
  }

  it('suggests Sepolia or Hoodi for goerli', function () {
    assert.throws(() => resolveChainId('goerli'), /Sepolia or Hoodi/);
  });

  it('points holesky users at Hoodi', function () {
    assert.throws(() => resolveChainId('holesky'), /use Hoodi/);
  });

  it('throws for unknown chains', function () {
    assert.throws(() => resolveChainId('notachain'), /Unknown chain/);
  });

  const INHERITED = ['constructor', '__proto__', 'hasOwnProperty', 'toString'];
  for (const input of INHERITED) {
    it('treats the inherited property name ' + input + ' as an unknown chain', function () {
      assert.throws(() => resolveChainId(input), /Unknown chain/);
    });
  }

  it('exposes the curated map', function () {
    assert.equal(CHAINS.mainnet, 1);
  });
});
