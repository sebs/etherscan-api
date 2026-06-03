export function transaction(getRequest) {
    return {
        /**
         * Returns the status of a specific transaction hash.
         * @param txhash - Transaction hash
         */
        getstatus(txhash) {
            return getRequest({ module: 'transaction', action: 'getstatus', txhash });
        },
    };
}
