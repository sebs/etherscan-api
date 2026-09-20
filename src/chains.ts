/**
 * Etherscan V2 uses a single base URL and selects the network with a `chainid`
 * query parameter. This module maps friendly chain names to their numeric chain
 * id. Anything not covered by the curated map can still be reached by passing a
 * raw numeric chainid.
 *
 * @see https://docs.etherscan.io/etherscan-v2 (V1 was deprecated 2025-08-15)
 */

/** Curated set of commonly requested chains → chainid. */
export const CHAINS: Record<string, number> = {
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

/** Retired networks — recognised only so we can fail with a helpful message. */
export const RETIRED_CHAINS: Record<string, string> = {
  ropsten: 'Ropsten was shut down in December 2022',
  rinkeby: 'Rinkeby was shut down in 2023',
  kovan: 'Kovan was shut down in 2023',
  goerli: 'Goerli was deprecated; use Sepolia or Holesky',
  morden: 'Morden was retired long ago; use Sepolia or Holesky',
  arbitrum_rinkeby: 'Arbitrum Rinkeby was retired; use Arbitrum Sepolia',
  avalanche_fuji: 'Snowtrace moved off the Etherscan API; pass a numeric chainid if you still need Fuji',
};

/**
 * Validate a numeric chainid. Chain ids are positive integers, so anything else
 * — NaN, Infinity, a negative, a fraction, or a value past the safe-integer
 * range — is a mistake that would otherwise travel into the query string as
 * `chainid=NaN` and fail server-side with nothing pointing back at the cause.
 */
function checkChainId(id: number, original: string | number): number {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error(
      `Invalid chainid ${JSON.stringify(original)}: expected a positive integer.`,
    );
  }
  return id;
}

/**
 * Resolve a chain name or numeric chainid to a numeric chainid.
 *
 * - `null` / `undefined` / `''` defaults to Ethereum mainnet (1).
 * - A number, or an all-digit string, is passed through once validated as a
 *   positive integer.
 * - A known name is mapped to its chainid.
 * - A retired or unknown name throws — silently switching networks on a
 *   blockchain client is dangerous (wrong-chain reads look successful).
 *
 * @throws {Error} If the chain is invalid, retired or unknown.
 */
export function resolveChainId(chain?: string | number | null): number {
  if (chain === null || chain === undefined || chain === '') {
    return 1;
  }

  if (typeof chain === 'number') {
    return checkChainId(chain, chain);
  }

  if (typeof chain !== 'string') {
    // Reachable from plain JS, where the string|number type is not enforced.
    // Without this the name lookup below fails with an opaque
    // "chain.toLowerCase is not a function".
    throw new Error(
      `Invalid chain ${JSON.stringify(chain)}: expected a chain name or a numeric chainid.`,
    );
  }

  if (/^\d+$/.test(chain)) {
    return checkChainId(Number(chain), chain);
  }

  const key = chain.toLowerCase();
  const known = CHAINS[key];
  if (known !== undefined) {
    return known;
  }

  const names = Object.keys(CHAINS).join(', ');
  const retired = RETIRED_CHAINS[key];
  if (retired !== undefined) {
    throw new Error(
      `Chain "${chain}" is no longer supported: ${retired}. ` +
        `Supported names: ${names} (or pass a numeric chainid).`,
    );
  }

  throw new Error(
    `Unknown chain "${chain}". Supported names: ${names} (or pass a numeric chainid).`,
  );
}
