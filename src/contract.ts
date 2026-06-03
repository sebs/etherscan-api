import type { GetRequest } from './get-request.js';
import type { EtherscanResponse } from './types.js';

export function contract(getRequest: GetRequest) {
  return {
    /**
     * Returns the ABI of a verified contract.
     * @param address - Contract address
     */
    getabi(address: string): Promise<EtherscanResponse> {
      return getRequest({ module: 'contract', action: 'getabi', address });
    },

    /**
     * Returns the source code of a verified contract.
     * @param address - Contract address
     */
    getsourcecode(address: string): Promise<EtherscanResponse> {
      return getRequest({ module: 'contract', action: 'getsourcecode', address });
    },
  };
}
