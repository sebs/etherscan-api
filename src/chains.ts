/**
 * Etherscan V2 uses a single base URL and selects the network with a `chainid`
 * query parameter. This module maps friendly chain names to their numeric chain
 * id. Anything not covered by the curated map can still be reached by passing a
 * raw numeric chainid.
 *
 * @see https://docs.etherscan.io/etherscan-v2 (V1 was deprecated 2025-08-15)
 */

/**
 * Curated set of commonly requested chains → chainid. Frozen: it is shared by
 * every client in the process, so a mutation would silently redirect them all.
 */
export const CHAINS: Readonly<Record<string, number>> = Object.freeze({
  mainnet: 1,
  homestead: 1,
  ethereum: 1,
  sepolia: 11155111,
  hoodi: 560048,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
  polygon: 137,
  bsc: 56,
  avalanche: 43114,
  avalanche_fuji: 43113,
});

/** Retired networks — recognised only so we can fail with a helpful message. Frozen. */
export const RETIRED_CHAINS: Readonly<Record<string, string>> = Object.freeze({
  ropsten: 'Ropsten was shut down in December 2022',
  rinkeby: 'Rinkeby was shut down in 2023',
  kovan: 'Kovan was shut down in 2023',
  goerli: 'Goerli was deprecated; use Sepolia or Hoodi',
  holesky: 'Holesky was shut down in 2025 and dropped from the Etherscan API; use Hoodi or Sepolia',
  morden: 'Morden was retired long ago; use Sepolia or Hoodi',
  arbitrum_rinkeby: 'Arbitrum Rinkeby was retired; use Arbitrum Sepolia',
});

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

  // Own-property checks only: a plain lookup would resolve inherited names such
  // as 'constructor' or '__proto__' to Object's prototype members.
  const key = chain.toLowerCase();
  if (Object.hasOwn(CHAINS, key)) {
    return CHAINS[key] as number;
  }

  const names = Object.keys(CHAINS).join(', ');
  if (Object.hasOwn(RETIRED_CHAINS, key)) {
    const retired = RETIRED_CHAINS[key];
    throw new Error(
      `Chain "${chain}" is no longer supported: ${retired}. ` +
        `Supported names: ${names} (or pass a numeric chainid).`,
    );
  }

  throw new Error(
    `Unknown chain "${chain}". Supported names: ${names} (or pass a numeric chainid).`,
  );
}
