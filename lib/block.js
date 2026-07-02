export function block(getRequest) {
    return {
        /**
         * Find the block reward for a given address and block.
         * @param address - Miner address
         * @param blockno - Block number (defaults to 0)
         */
        getblockreward(address, blockno) {
            return getRequest({ module: 'block', action: 'getblockreward', address, blockno: blockno ?? 0 });
        },
        /**
         * Returns the estimated time remaining, in seconds, until a certain block is mined.
         * @param blockno - Target block number
         */
        getblockcountdown(blockno) {
            return getRequest({ module: 'block', action: 'getblockcountdown', blockno });
        },
        /**
         * Returns the block number that was mined at a certain timestamp.
         * @param timestamp - Unix timestamp in seconds
         * @param closest - Return the closest block `'before'` (default) or `'after'` the timestamp
         */
        getblocknobytime(timestamp, closest = 'before') {
            return getRequest({ module: 'block', action: 'getblocknobytime', timestamp, closest });
        },
        /**
         * Returns the number of transactions in a block, broken down by type
         * (normal, internal, ERC-20, ERC-721 and ERC-1155).
         * @param blockno - Block number
         */
        getblocktxnscount(blockno) {
            return getRequest({ module: 'block', action: 'getblocktxnscount', blockno });
        },
    };
}
