import { forModule } from './get-request.js';
import type { RequestContext } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type { BlockReward, BlockCountdown, BlockTransactionCount } from './results.js';

/**
 * Largest timestamp accepted as Unix *seconds* (year ~5138). Anything above is
 * almost certainly milliseconds — `Date.now()` — which is off by 1000×.
 */
const MAX_UNIX_SECONDS = 1e11;

export function block(ctx: RequestContext) {
  const call = forModule(ctx.get, 'block');

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
    return call<BlockReward>('getblockreward', { blockno });
  }

  return {
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
    getblocknobytime(
      timestamp: string | number | Date,
      closest: 'before' | 'after' = 'before',
    ): Promise<EtherscanResponse<string>> {
      const seconds = timestamp instanceof Date ? Math.floor(timestamp.getTime() / 1000) : Number(timestamp);
      if (!Number.isSafeInteger(seconds) || seconds < 0) {
        return Promise.reject(new Error(`Invalid timestamp ${String(timestamp)}: expected Unix seconds or a Date`));
      }
      if (seconds > MAX_UNIX_SECONDS) {
        return Promise.reject(
          new Error(
            `Timestamp ${seconds} looks like milliseconds; pass Unix seconds (Math.floor(ms / 1000)) or a Date`,
          ),
        );
      }
      return call<string>('getblocknobytime', { timestamp: seconds, closest });
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
