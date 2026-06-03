export function account(getRequest) {
    return {
        /**
         * Returns the amount of Tokens a specific account owns.
         * @param address - Account address
         * @param tokenname - Name of the token
         * @param contractaddress - Token contract address
         * @example
         * api.account.tokenbalance(
         *   '0x4366ddc115d8cf213c564da36e64c8ebaa30cdbd',
         *   '',
         *   '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a'
         * );
         */
        tokenbalance(address, tokenname, contractaddress) {
            const params = { module: 'account', action: 'tokenbalance', tag: 'latest' };
            if (contractaddress) {
                params.contractaddress = contractaddress;
            }
            if (tokenname) {
                params.tokenname = tokenname;
            }
            if (address) {
                params.address = address;
            }
            return getRequest(params);
        },
        /**
         * Returns the balance of a specific account, or several accounts when given
         * an array (uses the `balancemulti` action).
         * @param address - A single address, or an array of addresses
         * @example
         * api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
         */
        balance(address) {
            let action = 'balance';
            let addr;
            if (Array.isArray(address)) {
                addr = address.join(',');
                action = 'balancemulti';
            }
            else {
                addr = address;
            }
            return getRequest({ module: 'account', action, tag: 'latest', address: addr });
        },
        /**
         * Get a list of internal transactions.
         * @param txhash - Transaction hash. If specified then `address` is ignored
         * @param address - Account address
         * @param startblock - Start block
         * @param endblock - End block
         * @param sort - Sort asc/desc
         * @example
         * api.account.txlistinternal('0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170');
         */
        txlistinternal(txhash, address, startblock, endblock, sort) {
            const params = { module: 'account', action: 'txlistinternal' };
            params.sort = sort || 'asc';
            if (txhash) {
                params.txhash = txhash;
            }
            else {
                params.address = address ?? '';
                params.startblock = startblock ?? 0;
                params.endblock = endblock ?? 'latest';
            }
            return getRequest(params);
        },
        /**
         * Get a list of transactions for a specific address.
         * @param address - Account address
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         * @example
         * api.account.txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', 1, 'latest', 1, 100, 'asc');
         */
        txlist(address, startblock, endblock, page, offset, sort) {
            return getRequest({
                module: 'account',
                action: 'txlist',
                startblock: startblock ?? 0,
                endblock: endblock ?? 'latest',
                page: page ?? 1,
                offset: offset ?? 100,
                sort: sort || 'asc',
                address,
            });
        },
        /**
         * Get a list of blocks that a specific account has mined.
         * @param address - Account address
         * @example
         * api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b');
         */
        getminedblocks(address) {
            return getRequest({ module: 'account', action: 'getminedblocks', address });
        },
        /**
         * Get a list of "ERC20 - Token Transfer Events" by address.
         * @param address - Account address
         * @param contractaddress - ERC20 token contract address (omit for all tokens)
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         */
        tokentx(address, contractaddress, startblock, endblock, page, offset, sort) {
            const params = {
                module: 'account',
                action: 'tokentx',
                startblock: startblock ?? 0,
                endblock: endblock ?? 'latest',
                page: page ?? 1,
                offset: offset ?? 100,
                sort: sort || 'asc',
                address,
            };
            if (contractaddress) {
                params.contractaddress = contractaddress;
            }
            return getRequest(params);
        },
        /**
         * Get a list of "ERC721 - Token Transfer Events" by address.
         * @param address - Account address
         * @param contractaddress - ERC721 token contract address (omit for all tokens)
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         */
        tokennfttx(address, contractaddress, startblock, endblock, page, offset, sort) {
            const params = {
                module: 'account',
                action: 'tokennfttx',
                startblock: startblock ?? 0,
                endblock: endblock ?? 'latest',
                page: page ?? 1,
                offset: offset ?? 100,
                sort: sort || 'asc',
                address,
            };
            if (contractaddress) {
                params.contractaddress = contractaddress;
            }
            return getRequest(params);
        },
        /**
         * Get a list of "ERC1155 - Token Transfer Events" by address.
         * @param address - Account address
         * @param contractaddress - ERC1155 token contract address (omit for all tokens)
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         */
        token1155tx(address, contractaddress, startblock, endblock, page, offset, sort) {
            const params = {
                module: 'account',
                action: 'token1155tx',
                startblock: startblock ?? 0,
                endblock: endblock ?? 'latest',
                page: page ?? 1,
                offset: offset ?? 100,
                sort: sort || 'asc',
                address,
            };
            if (contractaddress) {
                params.contractaddress = contractaddress;
            }
            return getRequest(params);
        },
        /**
         * Get the beacon chain withdrawals made to an address.
         * @param address - Account address
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         */
        txsBeaconWithdrawal(address, startblock, endblock, page, offset, sort) {
            return getRequest({
                module: 'account',
                action: 'txsBeaconWithdrawal',
                startblock: startblock ?? 0,
                endblock: endblock ?? 'latest',
                page: page ?? 1,
                offset: offset ?? 100,
                sort: sort || 'asc',
                address,
            });
        },
        /**
         * Get the list of L2 deposit transactions for an address.
         * @param address - Account address
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         */
        getdeposittxs(address, startblock, endblock, page, offset, sort) {
            return getRequest({
                module: 'account',
                action: 'getdeposittxs',
                startblock: startblock ?? 0,
                endblock: endblock ?? 'latest',
                page: page ?? 1,
                offset: offset ?? 100,
                sort: sort || 'asc',
                address,
            });
        },
        /**
         * Get the list of L2 withdrawal transactions for an address.
         * @param address - Account address
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         */
        getwithdrawaltxs(address, startblock, endblock, page, offset, sort) {
            return getRequest({
                module: 'account',
                action: 'getwithdrawaltxs',
                startblock: startblock ?? 0,
                endblock: endblock ?? 'latest',
                page: page ?? 1,
                offset: offset ?? 100,
                sort: sort || 'asc',
                address,
            });
        },
        /**
         * Returns the address that first funded a given address.
         * @param address - Account address
         */
        fundedby(address) {
            return getRequest({ module: 'account', action: 'fundedby', address });
        },
    };
}
