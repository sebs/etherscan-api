export function proxy(getRequest) {
    // Bind module:'proxy' once; every method names only its action and params.
    const call = (action, params = {}) => getRequest({ module: 'proxy', action, ...params });
    return {
        /** Returns the number of the most recent block (hex). */
        eth_blockNumber() {
            return call('eth_blockNumber');
        },
        /**
         * Returns information about a block by block number.
         * @param tag - Block number tag, e.g. `'0x10d4f'`
         * @param fullTransactions - When true (default) returns full transaction objects, otherwise only hashes
         */
        eth_getBlockByNumber(tag, fullTransactions = true) {
            return call('eth_getBlockByNumber', { tag, boolean: fullTransactions });
        },
        /**
         * Returns information about an uncle by block number and index.
         * @param tag - Block number tag
         * @param index - Uncle index position
         */
        eth_getUncleByBlockNumberAndIndex(tag, index) {
            return call('eth_getUncleByBlockNumberAndIndex', { tag, index });
        },
        /**
         * Returns the number of transactions in a block matching the given block number (hex).
         * @param tag - Block number tag
         */
        eth_getBlockTransactionCountByNumber(tag) {
            return call('eth_getBlockTransactionCountByNumber', { tag });
        },
        /**
         * Returns information about a transaction by hash.
         * @param txhash - Transaction hash
         */
        eth_getTransactionByHash(txhash) {
            return call('eth_getTransactionByHash', { txhash });
        },
        /**
         * Returns information about a transaction by block number and index.
         * @param tag - Block number tag
         * @param index - Transaction index position
         */
        eth_getTransactionByBlockNumberAndIndex(tag, index) {
            return call('eth_getTransactionByBlockNumberAndIndex', { tag, index });
        },
        /**
         * Returns the number of transactions sent from an address (hex).
         * @param address - Account address
         */
        eth_getTransactionCount(address) {
            return call('eth_getTransactionCount', { address });
        },
        /**
         * Submits a pre-signed transaction for broadcast. Resolves with the tx hash.
         * @param hex - Serialized signed message
         */
        eth_sendRawTransaction(hex) {
            return call('eth_sendRawTransaction', { hex });
        },
        /**
         * Returns the receipt of a transaction by hash.
         * @param txhash - Transaction hash
         */
        eth_getTransactionReceipt(txhash) {
            return call('eth_getTransactionReceipt', { txhash });
        },
        /**
         * Executes a new message call immediately without creating a transaction (hex).
         * @param to - Address to execute against
         * @param data - Hash of the method signature and encoded parameters
         * @param tag - Block number tag
         */
        eth_call(to, data, tag) {
            return call('eth_call', { to, data, tag });
        },
        /**
         * Returns code at a given address (hex).
         * @param address - Address to get code from
         * @param tag - Block number tag
         */
        eth_getCode(address, tag) {
            return call('eth_getCode', { address, tag });
        },
        /**
         * Returns the value from a storage position at a given address (hex).
         * @param address - Address to get storage from
         * @param position - Storage position
         * @param tag - Block number tag
         */
        eth_getStorageAt(address, position, tag) {
            return call('eth_getStorageAt', { address, position, tag });
        },
        /** Returns the current price per gas in wei (hex). */
        eth_gasPrice() {
            return call('eth_gasPrice');
        },
        /**
         * Estimates the gas needed for a transaction without adding it to the chain (hex).
         * @param to - Address to interact with
         * @param value - Value sent in the transaction
         * @param gasPrice - Gas price in wei
         * @param gas - Gas provided
         */
        eth_estimateGas(to, value, gasPrice, gas) {
            return call('eth_estimateGas', { to, value, gasPrice, gas });
        },
    };
}
