import type { GetRequest, QueryParams } from './get-request.js';
import type { EtherscanResponse } from './types.js';

export function stats(getRequest: GetRequest) {
  return {
    /**
     * Returns the supply of a token.
     * @param tokenname - Name of the token
     * @param contractaddress - Token contract address
     * @example
     * api.stats.tokensupply(null, '0x57d90b64a1a57749b0f932f1a3395792e12e7055');
     */
    tokensupply(tokenname?: string | null, contractaddress?: string): Promise<EtherscanResponse> {
      const params: QueryParams = { module: 'stats', action: 'tokensupply' };
      if (tokenname) {
        params.tokenname = tokenname;
      }
      if (contractaddress) {
        params.contractaddress = contractaddress;
      }
      return getRequest(params);
    },

    /** Returns the total supply of ether. */
    ethsupply(): Promise<EtherscanResponse> {
      return getRequest({ module: 'stats', action: 'ethsupply' });
    },

    /** Returns the total supply of ether including Eth2 staking and burnt fees. */
    ethsupply2(): Promise<EtherscanResponse> {
      return getRequest({ module: 'stats', action: 'ethsupply2' });
    },

    /** Returns the total number of discoverable nodes on the network. */
    nodecount(): Promise<EtherscanResponse> {
      return getRequest({ module: 'stats', action: 'nodecount' });
    },

    /** Returns the current ether price. */
    ethprice(): Promise<EtherscanResponse> {
      return getRequest({ module: 'stats', action: 'ethprice' });
    },
  };
}
