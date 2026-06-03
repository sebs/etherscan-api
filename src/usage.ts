import type { GetRequest, RawGet } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type { ChainListItem } from './results.js';

export function usage(getRequest: GetRequest, rawGet: RawGet) {
  return {
    /**
     * Returns the amount of API calls used and the daily limit for your API key.
     * (module `getapilimit`)
     */
    getapilimit(): Promise<EtherscanResponse> {
      return getRequest({ module: 'getapilimit', action: 'getapilimit' });
    },

    /**
     * Returns the list of chains supported by the Etherscan V2 API and their
     * chain ids. Hits the dedicated `/v2/chainlist` endpoint (no API key needed).
     */
    chainlist(): Promise<EtherscanResponse<ChainListItem[]>> {
      return rawGet<ChainListItem[]>('/v2/chainlist');
    },
  };
}
