export function stats(getRequest) {
    return {
        /**
         * Returns the supply of a token.
         * @param tokenname - Name of the token
         * @param contractaddress - Token contract address
         * @example
         * api.stats.tokensupply(null, '0x57d90b64a1a57749b0f932f1a3395792e12e7055');
         */
        tokensupply(tokenname, contractaddress) {
            const params = { module: 'stats', action: 'tokensupply' };
            if (tokenname) {
                params.tokenname = tokenname;
            }
            if (contractaddress) {
                params.contractaddress = contractaddress;
            }
            return getRequest(params);
        },
        /** Returns the total supply of ether. */
        ethsupply() {
            return getRequest({ module: 'stats', action: 'ethsupply' });
        },
        /** Returns the current ether price. */
        ethprice() {
            return getRequest({ module: 'stats', action: 'ethprice' });
        },
    };
}
