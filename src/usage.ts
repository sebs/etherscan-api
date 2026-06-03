import type { GetRequest } from './get-request.js';
import type { EtherscanResponse } from './types.js';

export function usage(getRequest: GetRequest) {
  return {
    /**
     * Returns the amount of API calls used and the daily limit for your API key.
     * (module `getapilimit`)
     */
    getapilimit(): Promise<EtherscanResponse> {
      return getRequest({ module: 'getapilimit', action: 'getapilimit' });
    },
  };
}
