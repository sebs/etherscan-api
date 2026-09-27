import httpTransport, { resolveTimeout } from './transport.js';
import { account } from './account.js';
import { block } from './block.js';
import { contract } from './contract.js';
import { log } from './log.js';
import { proxy } from './proxy.js';
import { stats } from './stats.js';
import { transaction } from './transaction.js';
import { gastracker } from './gastracker.js';
import { usage } from './usage.js';
import { resolveChainId } from './chains.js';
import { createRequestContext } from './get-request.js';
import type { RequestContext } from './get-request.js';
import type { Transport } from './types.js';

// Etherscan V2: one host for every chain; the network is chosen with `chainid`.
const HOST = 'https://api.etherscan.io';

/** The namespaced Etherscan API returned by {@link init}. */
export interface EtherscanApi {
  log: ReturnType<typeof log>;
  proxy: ReturnType<typeof proxy>;
  stats: ReturnType<typeof stats>;
  block: ReturnType<typeof block>;
  transaction: ReturnType<typeof transaction>;
  contract: ReturnType<typeof contract>;
  account: ReturnType<typeof account>;
  gastracker: ReturnType<typeof gastracker>;
  usage: ReturnType<typeof usage>;
}

/**
 * Every namespace factory, by the name it has on the client; {@link init}
 * builds the client from this table. Typed against {@link EtherscanApi}, which
 * stays a plain interface so the docs list the namespaces: a namespace missing
 * from either one is a compile error, so the two cannot drift apart.
 */
const NAMESPACES: { [K in keyof EtherscanApi]: (ctx: RequestContext) => EtherscanApi[K] } = {
  log,
  proxy,
  stats,
  block,
  transaction,
  contract,
  account,
  gastracker,
  usage,
};

/**
 * Create an Etherscan API client.
 *
 * @param apiKey - Your Etherscan API key (works across all chains in V2). Required.
 * @param chain - Chain name (e.g. `'sepolia'`, `'arbitrum'`) or numeric chainid; defaults to Ethereum mainnet
 * @param timeout - Request timeout in milliseconds (default 10000); must be positive and finite.
 *   A numeric string, e.g. from an environment variable, is accepted.
 * @param request - Custom HTTP transport; defaults to a built-in `node:https`/`node:http` request
 * @throws {Error} If `apiKey` is missing or invalid, or `chain`, `timeout` or `request` is invalid.
 */
export function init(
  apiKey?: string,
  chain?: string | number | null,
  timeout?: number | string | null,
  request?: Transport,
): EtherscanApi {
  // Fail here rather than per request: a placeholder key only turns an unset
  // environment variable into confusing auth errors later. Surrounding
  // whitespace (a key read from a file keeps its trailing newline) is dropped,
  // as it is for chain names.
  if (apiKey !== undefined && apiKey !== null && typeof apiKey !== 'string') {
    // Reachable from plain JS: a key was given, just not as a string.
    throw new Error(`Invalid API key: expected a string, got ${typeof apiKey}`);
  }
  const key = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (key === '') {
    throw new Error('An Etherscan API key is required: init(apiKey, chain?, timeout?, request?)');
  }
  const t = resolveTimeout(timeout);
  const chainid = resolveChainId(chain);
  if (request !== undefined && request !== null && typeof request !== 'function') {
    throw new Error(`Invalid request transport: expected a function, got ${typeof request}`);
  }
  const doRequest: Transport = request || httpTransport;

  // apikey + chainid are injected centrally so namespaces never repeat them.
  const defaults = { apikey: key, chainid };
  const config = { baseUrl: HOST, timeout: t };
  const ctx = createRequestContext(doRequest, defaults, config);

  // Object.fromEntries loses the key types; NAMESPACES' annotation above is
  // what guarantees every EtherscanApi key is built.
  return Object.fromEntries(
    Object.entries(NAMESPACES).map(([name, create]) => [name, create(ctx)]),
  ) as unknown as EtherscanApi;
}
