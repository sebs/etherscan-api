import type { RequestContext } from './get-request.js';
import { unixSeconds } from './validation.js';
import type { EtherscanResponse } from './types.js';
import type { BlockReward, BlockCountdown, BlockTransactionCount } from './results.js';

export function block(ctx: RequestContext) {
  const { call } = ctx.module('block');

  // Overloads: the public docs are on `getblockreward` in the returned object below.
  /** The block and uncle rewards for a block. */
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
    return call<BlockReward>('getblockreward', { blockno });
  }

  return {
    /**
     * Find the block and uncle rewards for a block.
     * @param blockno - Block number (the older `(address, blockno)` form is
     *   deprecated; its address is ignored)
     * @example
     * api.block.getblockreward(2165403);
     */
    getblockreward,

    /**
     * Returns the estimated time remaining, in seconds, until a certain block is mined.
     * @param blockno - Target block number
     */
    getblockcountdown(blockno: string | number): Promise<EtherscanResponse<BlockCountdown>> {
      return call<BlockCountdown>('getblockcountdown', { blockno });
    },

    /**
     * Returns the block number that was mined at a certain timestamp.
     * @param timestamp - Unix timestamp in seconds, or a `Date`
     * @param closest - Return the closest block `'before'` (default) or `'after'` the timestamp
     */
    async getblocknobytime(
      timestamp: string | number | Date,
      closest: 'before' | 'after' = 'before',
    ): Promise<EtherscanResponse<string>> {
      return call<string>('getblocknobytime', { timestamp: unixSeconds(timestamp), closest });
    },

    /**
     * Returns the number of transactions in a block, broken down by type
     * (normal, internal, ERC-20, ERC-721 and ERC-1155).
     * @param blockno - Block number
     */
    getblocktxnscount(blockno: string | number): Promise<EtherscanResponse<BlockTransactionCount>> {
      return call<BlockTransactionCount>('getblocktxnscount', { blockno });
    },
  };
}
