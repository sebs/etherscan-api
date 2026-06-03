import httpGet from './http-get.js';
import { account } from './account.js';
import { block } from './block.js';
import { contract } from './contract.js';
import { log } from './log.js';
import { proxy } from './proxy.js';
import { stats } from './stats.js';
import { transaction } from './transaction.js';
import { resolveChainId } from './chains.js';
import { createGetRequest } from './get-request.js';
// Etherscan V2: one host for every chain; the network is chosen with `chainid`.
const HOST = 'https://api.etherscan.io';
/**
 * Create an Etherscan API client.
 *
 * @param apiKey - Your Etherscan API key (works across all chains in V2)
 * @param chain - Chain name (e.g. `'sepolia'`, `'arbitrum'`) or numeric chainid; defaults to Ethereum mainnet
 * @param timeout - Request timeout in milliseconds (default 10000)
 * @param request - Custom HTTP transport; defaults to a built-in `node:https` GET
 */
export function init(apiKey, chain, timeout, request) {
    const key = apiKey || 'YourApiKeyToken';
    const t = timeout || 10000;
    const chainid = resolveChainId(chain);
    const doRequest = request || httpGet;
    // apikey + chainid are injected centrally so namespaces never repeat them.
    const getRequest = createGetRequest(doRequest, { apikey: key, chainid }, { baseUrl: HOST, timeout: t });
    return {
        log: log(getRequest),
        proxy: proxy(getRequest),
        stats: stats(getRequest),
        block: block(getRequest),
        transaction: transaction(getRequest),
        contract: contract(getRequest),
        account: account(getRequest),
    };
}
