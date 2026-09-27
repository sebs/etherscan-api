import type { GetRequest } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type { BlockReward, BlockCountdown, BlockTransactionCount } from './results.js';

export function block(getRequest: GetRequest) {
  /**
   * Find the block and uncle rewards for a block.
   * @param blockno - Block number
   * @example
   * api.block.getblockreward(2165403);
   */
  function getblockreward(blockno: string | number): Promise<EtherscanResponse<BlockReward>>;
  /**
   * @deprecated Etherscan's endpoint takes no address; call `getblockreward(blockno)`.
   * The address is ignored.
   */
  function getblockreward(address: string, blockno: string | number): Promise<EtherscanResponse<BlockReward>>;
  function getblockreward(
    first: string | number,
    legacyBlockno?: string | number,
  ): Promise<EtherscanResponse<BlockReward>> {
    // Older callers pass (address, blockno); the address was never used by
    // the endpoint, so only the block number is sent.
    const blockno = legacyBlockno ?? first;
    return getRequest<BlockReward>({ module: 'block', action: 'getblockreward', blockno });
  }

  return {
    getblockreward,

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

    /**
     * Returns the number of transactions in a block, broken down by type
     * (normal, internal, ERC-20, ERC-721 and ERC-1155).
     * @param blockno - Block number
     */
    getblocktxnscount(blockno: string | number): Promise<EtherscanResponse<BlockTransactionCount>> {
      return getRequest<BlockTransactionCount>({ module: 'block', action: 'getblocktxnscount', blockno });
    },
  };
}
