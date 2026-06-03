export function contract(getRequest) {
    return {
        /**
         * Returns the ABI of a verified contract.
         * @param address - Contract address
         */
        getabi(address) {
            return getRequest({ module: 'contract', action: 'getabi', address });
        },
        /**
         * Returns the source code of a verified contract.
         * @param address - Contract address
         */
        getsourcecode(address) {
            return getRequest({ module: 'contract', action: 'getsourcecode', address });
        },
    };
}
