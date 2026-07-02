/** Copy the defined advanced-filter fields onto a params object. */
function applyFilter(params, filter) {
    if (!filter)
        return;
    if (filter.from) {
        params.from = filter.from;
    }
    if (filter.to) {
        params.to = filter.to;
    }
    if (filter.fromto_opr) {
        params.fromto_opr = filter.fromto_opr;
    }
}
/**
 * Apply the shared start/end block, paging and sort defaults to a params object
 * (the block repeated by the paged list endpoints). `sort` uses `||` so an empty
 * string coerces to `'asc'` rather than being sent as a bare `sort=`.
 */
function listRange(params, startblock, endblock, page, offset, sort) {
    params.startblock = startblock ?? 0;
    params.endblock = endblock ?? 'latest';
    params.page = page ?? 1;
    params.offset = offset ?? 100;
    params.sort = sort || 'asc';
}
export function account(getRequest) {
    // Bind module:'account' once; every method names only its action and params.
    const call = (action, params = {}) => getRequest({ module: 'account', action, ...params });
    // Shared body for the ERC-20/721/1155 token-transfer endpoints, which differ
    // only by action string and result type. Kept private; the public methods
    // below preserve their own signatures, JSDoc and result generics.
    function tokenTransfers(action, address, contractaddress, startblock, endblock, page, offset, sort, filter) {
        const params = {};
        listRange(params, startblock, endblock, page, offset, sort);
        if (address) {
            params.address = address;
        }
        if (contractaddress) {
            params.contractaddress = contractaddress;
        }
        applyFilter(params, filter);
        return call(action, params);
    }
    // Shared body for the address-scoped paged list endpoints (beacon withdrawals
    // and the L2 deposit/withdrawal lists), which differ only by action string.
    const pagedByAddress = (action) => (address, startblock, endblock, page, offset, sort) => {
        const params = { address };
        listRange(params, startblock, endblock, page, offset, sort);
        return call(action, params);
    };
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
            const params = { tag: 'latest' };
            if (contractaddress) {
                params.contractaddress = contractaddress;
            }
            if (tokenname) {
                params.tokenname = tokenname;
            }
            if (address) {
                params.address = address;
            }
            return call('tokenbalance', params);
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
            return call(action, { tag: 'latest', address: addr });
        },
        /**
         * Get a list of internal transactions.
         * @param txhash - Transaction hash. If specified then `address` is ignored
         * @param address - Account address
         * @param startblock - Start block
         * @param endblock - End block
         * @param sort - Sort asc/desc
         * @param filter - Optional advanced filter (Beta): filter by `from`/`to` instead of `address`
         * @example
         * api.account.txlistinternal('0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170');
         */
        txlistinternal(txhash, address, startblock, endblock, sort, filter) {
            const params = {};
            params.sort = sort || 'asc';
            if (txhash) {
                params.txhash = txhash;
            }
            else {
                if (address) {
                    params.address = address;
                }
                params.startblock = startblock ?? 0;
                params.endblock = endblock ?? 'latest';
            }
            applyFilter(params, filter);
            return call('txlistinternal', params);
        },
        /**
         * Get a list of transactions for a specific address.
         * @param address - Account address (optional when filtering with `filter`)
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         * @param filter - Optional advanced filter (Beta): filter by `from`/`to` instead of `address`
         * @example
         * api.account.txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', 1, 'latest', 1, 100, 'asc');
         */
        txlist(address, startblock, endblock, page, offset, sort, filter) {
            const params = {};
            listRange(params, startblock, endblock, page, offset, sort);
            if (address) {
                params.address = address;
            }
            applyFilter(params, filter);
            return call('txlist', params);
        },
        /**
         * Get a list of blocks that a specific account has mined.
         * @param address - Account address
         * @example
         * api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b');
         */
        getminedblocks(address) {
            return call('getminedblocks', { address });
        },
        /**
         * Get a list of "ERC20 - Token Transfer Events" by address.
         * @param address - Account address (optional when filtering with `filter`)
         * @param contractaddress - ERC20 token contract address (omit for all tokens)
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         * @param filter - Optional advanced filter (Beta): filter by `from`/`to` instead of `address`
         */
        tokentx(address, contractaddress, startblock, endblock, page, offset, sort, filter) {
            return tokenTransfers('tokentx', address, contractaddress, startblock, endblock, page, offset, sort, filter);
        },
        /**
         * Get a list of "ERC721 - Token Transfer Events" by address.
         * @param address - Account address (optional when filtering with `filter`)
         * @param contractaddress - ERC721 token contract address (omit for all tokens)
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         * @param filter - Optional advanced filter (Beta): filter by `from`/`to` instead of `address`
         */
        tokennfttx(address, contractaddress, startblock, endblock, page, offset, sort, filter) {
            return tokenTransfers('tokennfttx', address, contractaddress, startblock, endblock, page, offset, sort, filter);
        },
        /**
         * Get a list of "ERC1155 - Token Transfer Events" by address.
         * @param address - Account address (optional when filtering with `filter`)
         * @param contractaddress - ERC1155 token contract address (omit for all tokens)
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         * @param filter - Optional advanced filter (Beta): filter by `from`/`to` instead of `address`
         */
        token1155tx(address, contractaddress, startblock, endblock, page, offset, sort, filter) {
            return tokenTransfers('token1155tx', address, contractaddress, startblock, endblock, page, offset, sort, filter);
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
        txsBeaconWithdrawal: pagedByAddress('txsBeaconWithdrawal'),
        /**
         * Get the list of L2 deposit transactions for an address.
         * @param address - Account address
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         */
        getdeposittxs: pagedByAddress('getdeposittxs'),
        /**
         * Get the list of L2 withdrawal transactions for an address.
         * @param address - Account address
         * @param startblock - Start block
         * @param endblock - End block
         * @param page - Page number
         * @param offset - Max records to return
         * @param sort - Sort asc/desc
         */
        getwithdrawaltxs: pagedByAddress('getwithdrawaltxs'),
        /**
         * Returns the address that first funded a given address.
         * @param address - Account address
         */
        fundedby(address) {
            return call('fundedby', { address });
        },
        /**
         * Get the list of Plasma bridge deposit transactions received by an address
         * (Polygon, Gnosis and BitTorrent Chain).
         * @param address - Account address
         * @param page - Page number
         * @param offset - Max records to return
         */
        txnbridge(address, page, offset) {
            return call('txnbridge', { address, page: page ?? 1, offset: offset ?? 100 });
        },
    };
}
