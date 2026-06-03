export function proxy(getRequest) {
    return {
        /** Returns the number of the most recent block (hex). */
        eth_blockNumber() {
            return getRequest({ module: 'proxy', action: 'eth_blockNumber' });
        },
        /**
         * Returns information about a block by block number.
         * @param tag - Block number tag, e.g. `'0x10d4f'`
         * @param fullTransactions - When true (default) returns full transaction objects, otherwise only hashes
         */
        eth_getBlockByNumber(tag, fullTransactions = true) {
            return getRequest({ module: 'proxy', action: 'eth_getBlockByNumber', tag, boolean: fullTransactions });
        },
        /**
         * Returns information about an uncle by block number and index.
         * @param tag - Block number tag
         * @param index - Uncle index position
         */
        eth_getUncleByBlockNumberAndIndex(tag, index) {
            return getRequest({ module: 'proxy', action: 'eth_getUncleByBlockNumberAndIndex', tag, index });
        },
        /**
         * Returns the number of transactions in a block matching the given block number (hex).
         * @param tag - Block number tag
         */
        eth_getBlockTransactionCountByNumber(tag) {
            return getRequest({ module: 'proxy', action: 'eth_getBlockTransactionCountByNumber', tag });
        },
        /**
         * Returns information about a transaction by hash.
         * @param txhash - Transaction hash
         */
        eth_getTransactionByHash(txhash) {
            return getRequest({ module: 'proxy', action: 'eth_getTransactionByHash', txhash });
        },
        /**
         * Returns information about a transaction by block number and index.
         * @param tag - Block number tag
         * @param index - Transaction index position
         */
        eth_getTransactionByBlockNumberAndIndex(tag, index) {
            return getRequest({ module: 'proxy', action: 'eth_getTransactionByBlockNumberAndIndex', tag, index });
        },
        /**
         * Returns the number of transactions sent from an address (hex).
         * @param address - Account address
         */
        eth_getTransactionCount(address) {
            return getRequest({ module: 'proxy', action: 'eth_getTransactionCount', address });
        },
        /**
         * Submits a pre-signed transaction for broadcast. Resolves with the tx hash.
         * @param hex - Serialized signed message
         */
        eth_sendRawTransaction(hex) {
            return getRequest({ module: 'proxy', action: 'eth_sendRawTransaction', hex });
        },
        /**
         * Returns the receipt of a transaction by hash.
         * @param txhash - Transaction hash
         */
        eth_getTransactionReceipt(txhash) {
            return getRequest({ module: 'proxy', action: 'eth_getTransactionReceipt', txhash });
        },
        /**
         * Executes a new message call immediately without creating a transaction (hex).
         * @param to - Address to execute against
         * @param data - Hash of the method signature and encoded parameters
         * @param tag - Block number tag
         */
        eth_call(to, data, tag) {
            return getRequest({ module: 'proxy', action: 'eth_call', to, data, tag });
        },
        /**
         * Returns code at a given address (hex).
         * @param address - Address to get code from
         * @param tag - Block number tag
         */
        eth_getCode(address, tag) {
            return getRequest({ module: 'proxy', action: 'eth_getCode', address, tag });
        },
        /**
         * Returns the value from a storage position at a given address (hex).
         * @param address - Address to get storage from
         * @param position - Storage position
         * @param tag - Block number tag
         */
        eth_getStorageAt(address, position, tag) {
            return getRequest({ module: 'proxy', action: 'eth_getStorageAt', address, position, tag });
        },
        /** Returns the current price per gas in wei (hex). */
        eth_gasPrice() {
            return getRequest({ module: 'proxy', action: 'eth_gasPrice' });
        },
        /**
         * Estimates the gas needed for a transaction without adding it to the chain (hex).
         * @param to - Address to interact with
         * @param value - Value sent in the transaction
         * @param gasPrice - Gas price in wei
         * @param gas - Gas provided
         */
        eth_estimateGas(to, value, gasPrice, gas) {
            return getRequest({ module: 'proxy', action: 'eth_estimateGas', to, value, gasPrice, gas });
        },
    };
}
