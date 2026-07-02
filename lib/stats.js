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
        /** Returns the total supply of ether including Eth2 staking and burnt fees. */
        ethsupply2() {
            return getRequest({ module: 'stats', action: 'ethsupply2' });
        },
        /** Returns the total number of discoverable nodes on the network. */
        nodecount() {
            return getRequest({ module: 'stats', action: 'nodecount' });
        },
        /** Returns the current ether price. */
        ethprice() {
            return getRequest({ module: 'stats', action: 'ethprice' });
        },
        /**
         * Returns the size of the blockchain, in bytes, sampled daily over a date range.
         * @param startdate - Start date, `yyyy-MM-dd`
         * @param enddate - End date, `yyyy-MM-dd`
         * @param clienttype - Node client to measure: `'geth'` (default) or `'parity'`
         * @param syncmode - Sync mode: `'default'` (default) or `'archive'`
         * @param sort - Sort asc/desc (default `'asc'`)
         * @example
         * api.stats.chainsize('2019-02-01', '2019-02-28');
         */
        chainsize(startdate, enddate, clienttype = 'geth', syncmode = 'default', sort = 'asc') {
            return getRequest({
                module: 'stats',
                action: 'chainsize',
                startdate,
                enddate,
                clienttype,
                syncmode,
                sort,
            });
        },
    };
}
