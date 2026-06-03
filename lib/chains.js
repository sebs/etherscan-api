'use strict';

/**
 * Etherscan V2 uses a single base URL and selects the network with a
 * `chainid` query parameter. This module maps friendly chain names to their
 * numeric chain id. Anything not covered by the curated map can still be
 * reached by passing a raw numeric chainid.
 *
 * @see https://docs.etherscan.io/etherscan-v2 (V1 was deprecated 2025-08-15)
 */

// Curated set of commonly requested chains → chainid.
// The long tail is reachable via numeric passthrough (see resolveChainId).
const CHAINS = {
  mainnet: 1,
  homestead: 1,
  ethereum: 1,
  sepolia: 11155111,
  holesky: 17000,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
  polygon: 137,
  bsc: 56,
  avalanche: 43114,
};

// Retired networks — recognised only so we can fail with a helpful message
// instead of a generic "unknown chain".
const RETIRED_CHAINS = {
  ropsten: 'Ropsten was shut down in December 2022',
  rinkeby: 'Rinkeby was shut down in 2023',
  kovan: 'Kovan was shut down in 2023',
  goerli: 'Goerli was deprecated; use Sepolia or Holesky',
  morden: 'Morden was retired long ago; use Sepolia or Holesky',
  arbitrum_rinkeby: 'Arbitrum Rinkeby was retired; use Arbitrum Sepolia',
  avalanche_fuji: 'Snowtrace moved off the Etherscan API; pass a numeric chainid if you still need Fuji',
};

/**
 * Resolve a chain name or numeric chainid to a numeric chainid.
 *
 * - `null` / `undefined` / `''` defaults to Ethereum mainnet (1).
 * - A number, or an all-digit string, is passed through unchanged.
 * - A known name is mapped to its chainid.
 * - A retired or unknown name throws — silently switching networks on a
 *   blockchain client is dangerous (wrong-chain reads look successful).
 *
 * @param {string|number} [chain] - Chain name or numeric chainid.
 * @returns {number} The resolved chainid.
 * @throws {Error} If the chain is retired or unknown.
 */
function resolveChainId(chain) {
  if (chain === null || chain === undefined || chain === '') {
    return 1;
  }

  if (typeof chain === 'number') {
    return chain;
  }

  if (/^\d+$/.test(chain)) {
    return Number(chain);
  }

  const key = String(chain).toLowerCase();

  if (CHAINS[key]) {
    return CHAINS[key];
  }

  const names = Object.keys(CHAINS).join(', ');

  if (RETIRED_CHAINS[key]) {
    throw new Error(
      `Chain "${chain}" is no longer supported: ${RETIRED_CHAINS[key]}. ` +
      `Supported names: ${names} (or pass a numeric chainid).`
    );
  }

  throw new Error(
    `Unknown chain "${chain}". Supported names: ${names} (or pass a numeric chainid).`
  );
}

module.exports = { resolveChainId, CHAINS, RETIRED_CHAINS };
