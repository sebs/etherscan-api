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
 * Render a rejected chain value for an error message. Numbers go through
 * String(): JSON.stringify turns NaN and Infinity into "null". JSON.stringify
 * also throws (BigInt, circular objects) or returns undefined (symbols,
 * functions), so those fall back to String() rather than masking the real error.
 */
function describeValue(value: unknown): string {
  if (typeof value === 'number') return String(value);
  if (typeof value === 'bigint') return value + 'n';
  try {
    const json = JSON.stringify(value);
    if (json !== undefined) return json;
  } catch {
    // fall through
  }
  return String(value);
}

/**
 * Validate a numeric chainid. Chain ids are positive integers, so anything else
 * — NaN, Infinity, a negative, a fraction, or a value past the safe-integer
 * range — is a mistake that would otherwise travel into the query string as
 * `chainid=NaN` and fail server-side with nothing pointing back at the cause.
 */
function checkChainId(id: number, original: string | number): number {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error(
      `Invalid chainid ${describeValue(original)}: expected a positive integer up to ${Number.MAX_SAFE_INTEGER}.`,
    );
  }
  return id;
}

/**
 * Resolve a chain name or numeric chainid to a numeric chainid.
 *
 * - `null` / `undefined` / `''` defaults to Ethereum mainnet (1).
 * - A number, an all-digit string, or a `0x` hex string (the EIP-155 form that
 *   `eth_chainId` returns) is passed through once validated as a positive integer.
 * - Surrounding whitespace in a string is ignored (values from env/config files).
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
      `Invalid chain ${describeValue(chain)}: expected a chain name or a numeric chainid.`,
    );
  }

  const trimmed = chain.trim();
  if (/^\d+$/.test(trimmed) || /^0x[0-9a-f]+$/i.test(trimmed)) {
    return checkChainId(Number(trimmed), chain);
  }
  // A number in another notation ('1e3', '1_000', '1.0', '-1') is a malformed
  // chainid, not an unknown chain name.
  if (/^[+-]?[\d_]*\.?\d[\d_]*(e[+-]?\d+)?$/i.test(trimmed)) {
    throw new Error(
      `Invalid chainid ${describeValue(chain)}: expected decimal digits or 0x hex, e.g. '137' or '0x89'.`,
    );
  }

  // Own-property checks only: a plain lookup would resolve inherited names such
  // as 'constructor' or '__proto__' to Object's prototype members.
  const key = trimmed.toLowerCase();
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
