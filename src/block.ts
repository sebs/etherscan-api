import type { GetRequest } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type { BlockReward, BlockCountdown } from './results.js';

export function block(getRequest: GetRequest) {
  return {
    /**
     * Find the block reward for a given address and block.
     * @param address - Miner address
     * @param blockno - Block number (defaults to 0)
     */
    getblockreward(address: string, blockno?: string | number): Promise<EtherscanResponse<BlockReward>> {
      return getRequest<BlockReward>({ module: 'block', action: 'getblockreward', address, blockno: blockno ?? 0 });
    },

    /**
     * Returns the estimated time remaining, in seconds, until a certain block is mined.
     * @param blockno - Target block number
     */
    getblockcountdown(blockno: string | number): Promise<EtherscanResponse<BlockCountdown>> {
      return getRequest<BlockCountdown>({ module: 'block', action: 'getblockcountdown', blockno });
    },

    /**
     * Returns the block number that was mined at a certain timestamp.
     * @param timestamp - Unix timestamp in seconds
     * @param closest - Return the closest block `'before'` (default) or `'after'` the timestamp
     */
    getblocknobytime(
      timestamp: string | number,
      closest: 'before' | 'after' = 'before',
    ): Promise<EtherscanResponse<string>> {
      return getRequest<string>({ module: 'block', action: 'getblocknobytime', timestamp, closest });
    },
  };
}
