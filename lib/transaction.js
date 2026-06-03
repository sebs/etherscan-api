export function transaction(getRequest) {
    return {
        /**
         * Returns the status of a specific transaction hash.
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
