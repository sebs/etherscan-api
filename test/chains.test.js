import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveChainId, CHAINS, RETIRED_CHAINS } from '../lib/chains.js';

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

  const HEX = [['0x1', 1], ['0xa4b1', 42161], ['0XAA36A7', 11155111]];
  for (const [input, expected] of HEX) {
    it('parses the hex chainid ' + input, function () {
      assert.equal(resolveChainId(input), expected);
    });
  }

  it('rejects the hex chainid 0x0', function () {
    assert.throws(() => resolveChainId('0x0'), /Invalid chainid "0x0"/);
  });

  const PADDED = [[' sepolia ', 11155111], ['base\n', 8453], ['\t137 ', 137]];
  for (const [input, expected] of PADDED) {
    it('ignores surrounding whitespace in ' + JSON.stringify(input), function () {
      assert.equal(resolveChainId(input), expected);
    });
  }

  it('still rejects a whitespace-only chain', function () {
    assert.throws(() => resolveChainId('   '), /Unknown chain/);
  });

  const INVALID_NUMERIC = [NaN, Infinity, -Infinity, -1, 0, 1.5, 1e21];
  for (const input of INVALID_NUMERIC) {
    it('rejects the invalid chainid ' + String(input), function () {
      assert.throws(() => resolveChainId(input), /Invalid chainid/);
    });
  }

  for (const [input, shown] of [[NaN, 'NaN'], [Infinity, 'Infinity'], [-Infinity, '-Infinity']]) {
    it('names ' + shown + ' in the error, not "null"', function () {
      assert.throws(() => resolveChainId(input), new RegExp('^Error: Invalid chainid ' + shown + ':'));
    });
  }

  const INVALID_NUMERIC_STRINGS = ['0', '-1', '1e3', '1_000', '1.0', '+5'];
  for (const input of INVALID_NUMERIC_STRINGS) {
    it('rejects the invalid numeric string ' + JSON.stringify(input) + ' as an invalid chainid', function () {
      assert.throws(() => resolveChainId(input), /Invalid chainid/);
    });
  }

  it('says why a chainid past the safe-integer range is invalid', function () {
    assert.throws(() => resolveChainId('9007199254740993'), /positive integer up to 9007199254740991/);
  });

  it('still treats a name containing digits as a name', function () {
    assert.throws(() => resolveChainId('base2'), /Unknown chain "base2"/);
  });

  const NON_STRING = [true, {}, []];
  for (const input of NON_STRING) {
    it('throws a clear error, not a TypeError, for ' + JSON.stringify(input), function () {
      assert.throws(
        () => resolveChainId(input),
        (err) => err instanceof Error && !/toLowerCase/.test(err.message),
      );
    });
  }

  it('explains a BigInt chainid instead of failing to serialize it', function () {
    assert.throws(() => resolveChainId(1n), /^Error: Invalid chain 1n: expected a chain name or a numeric chainid/);
  });

  it('explains a circular object instead of failing to serialize it', function () {
    const circular = {};
    circular.self = circular;
    assert.throws(() => resolveChainId(circular), /^Error: Invalid chain \[object Object\]/);
  });

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

  // Shared by every client in the process: a mutation must not redirect them.
  it('does not let callers remap a chain name', function () {
    assert.throws(() => { CHAINS.mainnet = 5; }, TypeError);
    assert.equal(resolveChainId('mainnet'), 1);
  });

  it('does not let callers add a chain name', function () {
    assert.throws(() => { CHAINS.evil = 5; }, TypeError);
  });

  it('does not let callers un-retire a chain', function () {
    assert.throws(() => { delete RETIRED_CHAINS.goerli; }, TypeError);
  });
});
