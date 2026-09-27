import type { RequestContext } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type { ApiLimit, ChainListResponse } from './results.js';

export function usage(ctx: RequestContext) {
  const { call } = ctx.module('getapilimit');

  return {
    /**
     * Returns the amount of API calls used and the daily limit for your API key.
     * (module `getapilimit`)
     */
    getapilimit(): Promise<EtherscanResponse<ApiLimit>> {
      return call<ApiLimit>('getapilimit');
    },

    /**
     * Returns the list of chains supported by the Etherscan V2 API and their
     * chain ids. Hits the dedicated `/v2/chainlist` endpoint. Etherscan needs no
     * key for it, so none is sent, but `init()` still requires one to create the client.
     */
    chainlist(): Promise<ChainListResponse> {
      return ctx.raw<ChainListResponse>('/v2/chainlist');
    },
  };
}
