export function transaction(getRequest) {
    return {
        /**
         * Returns the contract-execution status of a transaction (was the tx itself
         * an error).
         * @param txhash - Transaction hash
         */
        getstatus(txhash) {
            return getRequest({ module: 'transaction', action: 'getstatus', txhash });
        },
        /**
         * Returns the receipt status of a transaction (only for post-Byzantium blocks).
         * @param txhash - Transaction hash
         */
        gettxreceiptstatus(txhash) {
            return getRequest({ module: 'transaction', action: 'gettxreceiptstatus', txhash });
        },
    };
}
