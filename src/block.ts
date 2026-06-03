import type { GetRequest } from './get-request.js';
import type { EtherscanResponse } from './types.js';

export function block(getRequest: GetRequest) {
  return {
    /**
     * Find the block reward for a given address and block.
     * @param address - Miner address
     * @param blockno - Block number (defaults to 0)
     */
    getblockreward(address: string, blockno?: string | number): Promise<EtherscanResponse> {
      return getRequest({ module: 'block', action: 'getblockreward', address, blockno: blockno ?? 0 });
    },
  };
}
