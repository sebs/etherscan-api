import type { GetRequest } from './get-request.js';
import type { EtherscanResponse } from './types.js';

export function transaction(getRequest: GetRequest) {
  return {
    /**
     * Returns the status of a specific transaction hash.
     * @param txhash - Transaction hash
     */
    getstatus(txhash: string): Promise<EtherscanResponse> {
      return getRequest({ module: 'transaction', action: 'getstatus', txhash });
    },

    /**
     * Returns the receipt status of a transaction (only for post-Byzantium blocks).
     * @param txhash - Transaction hash
     */
    gettxreceiptstatus(txhash: string): Promise<EtherscanResponse> {
      return getRequest({ module: 'transaction', action: 'gettxreceiptstatus', txhash });
    },
  };
}
