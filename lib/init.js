import httpTransport from './transport.js';
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
import { createGetRequest, createPostRequest } from './get-request.js';
// Etherscan V2: one host for every chain; the network is chosen with `chainid`.
const HOST = 'https://api.etherscan.io';
/**
 * Create an Etherscan API client.
 *
 * @param apiKey - Your Etherscan API key (works across all chains in V2)
 * @param chain - Chain name (e.g. `'sepolia'`, `'arbitrum'`) or numeric chainid; defaults to Ethereum mainnet
 * @param timeout - Request timeout in milliseconds (default 10000)
 * @param request - Custom HTTP transport; defaults to a built-in `node:https`/`node:http` request
 */
export function init(apiKey, chain, timeout, request) {
    const key = apiKey || 'YourApiKeyToken';
    const t = timeout || 10000;
    const chainid = resolveChainId(chain);
    const doRequest = request || httpTransport;
    // apikey + chainid are injected centrally so namespaces never repeat them.
    const defaults = { apikey: key, chainid };
    const config = { baseUrl: HOST, timeout: t };
    const getRequest = createGetRequest(doRequest, defaults, config);
    const postRequest = createPostRequest(doRequest, defaults, config);
    return {
        log: log(getRequest),
        proxy: proxy(getRequest),
        stats: stats(getRequest),
        block: block(getRequest),
        transaction: transaction(getRequest),
        contract: contract(getRequest, postRequest),
        account: account(getRequest),
        gastracker: gastracker(getRequest),
        usage: usage(getRequest),
    };
}
