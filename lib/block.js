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
    };
}
