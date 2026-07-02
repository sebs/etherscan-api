import type { GetRequest, QueryParams } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type {
  MultiBalanceItem,
  NormalTransaction,
  InternalTransaction,
  Erc20Transfer,
  Erc721Transfer,
  Erc1155Transfer,
  MinedBlock,
} from './results.js';

/**
 * Advanced-filter fields (Beta) accepted by the transaction-list endpoints.
 * Filter by sender and/or recipient instead of a single `address`. Provide
 * `from`, `to`, or both; `fromto_opr` chooses whether both must match
 * (`'and'`) or either (`'or'`).
 * @see https://docs.etherscan.io/api-reference/endpoint/advanced-filter-txlist
 */
export interface AdvancedFilter {
  /** Sender address to filter by. */
  from?: string;
  /** Recipient address to filter by. */
  to?: string;
  /** Operator between `from` and `to`: `'and'` (both match) or `'or'` (either). */
  fromto_opr?: 'and' | 'or';
}

/** Copy the defined advanced-filter fields onto a params object. */
function applyFilter(params: QueryParams, filter?: AdvancedFilter): void {
  if (!filter) return;
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
function listRange(
  params: QueryParams,
  startblock?: string | number,
  endblock?: string | number,
  page?: number,
  offset?: number,
  sort?: string,
): void {
  params.startblock = startblock ?? 0;
  params.endblock = endblock ?? 'latest';
  params.page = page ?? 1;
  params.offset = offset ?? 100;
  params.sort = sort || 'asc';
}

export function account(getRequest: GetRequest) {
  // Bind module:'account' once; every method names only its action and params.
  const call = <T = unknown>(action: string, params: QueryParams = {}) =>
    getRequest<T>({ module: 'account', action, ...params });

  // Shared body for the ERC-20/721/1155 token-transfer endpoints, which differ
  // only by action string and result type. Kept private; the public methods
  // below preserve their own signatures, JSDoc and result generics.
  function tokenTransfers<T>(
    action: string,
    address?: string,
    contractaddress?: string,
    startblock?: string | number,
    endblock?: string | number,
    page?: number,
    offset?: number,
    sort?: string,
    filter?: AdvancedFilter,
  ): Promise<EtherscanResponse<T>> {
    const params: QueryParams = {};
    listRange(params, startblock, endblock, page, offset, sort);
    if (address) {
      params.address = address;
    }
    if (contractaddress) {
      params.contractaddress = contractaddress;
    }
    applyFilter(params, filter);
    return call<T>(action, params);
  }

  // Shared body for the address-scoped paged list endpoints (beacon withdrawals
  // and the L2 deposit/withdrawal lists), which differ only by action string.
  const pagedByAddress =
    (action: string) =>
    (
      address: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
    ): Promise<EtherscanResponse> => {
      const params: QueryParams = { address };
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
    tokenbalance(address?: string, tokenname?: string, contractaddress?: string): Promise<EtherscanResponse<string>> {
      const params: QueryParams = { tag: 'latest' };
      if (contractaddress) {
        params.contractaddress = contractaddress;
      }
      if (tokenname) {
        params.tokenname = tokenname;
      }
      if (address) {
        params.address = address;
      }
      return call<string>('tokenbalance', params);
    },

    /**
     * Returns the balance of a specific account, or several accounts when given
     * an array (uses the `balancemulti` action).
     * @param address - A single address, or an array of addresses
     * @example
     * api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
     */
    balance(address: string | string[]): Promise<EtherscanResponse<string | MultiBalanceItem[]>> {
      let action = 'balance';
      let addr: string;
      if (Array.isArray(address)) {
        addr = address.join(',');
        action = 'balancemulti';
      } else {
        addr = address;
      }
      return call<string | MultiBalanceItem[]>(action, { tag: 'latest', address: addr });
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
    txlistinternal(
      txhash?: string,
      address?: string,
      startblock?: string | number,
      endblock?: string | number,
      sort?: string,
      filter?: AdvancedFilter,
    ): Promise<EtherscanResponse<InternalTransaction[]>> {
      const params: QueryParams = {};
      params.sort = sort || 'asc';

      if (txhash) {
        params.txhash = txhash;
      } else {
        if (address) {
          params.address = address;
        }
        params.startblock = startblock ?? 0;
        params.endblock = endblock ?? 'latest';
      }
      applyFilter(params, filter);
      return call<InternalTransaction[]>('txlistinternal', params);
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
    txlist(
      address?: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
      filter?: AdvancedFilter,
    ): Promise<EtherscanResponse<NormalTransaction[]>> {
      const params: QueryParams = {};
      listRange(params, startblock, endblock, page, offset, sort);
      if (address) {
        params.address = address;
      }
      applyFilter(params, filter);
      return call<NormalTransaction[]>('txlist', params);
    },

    /**
     * Get a list of blocks that a specific account has mined.
     * @param address - Account address
     * @example
     * api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b');
     */
    getminedblocks(address: string): Promise<EtherscanResponse<MinedBlock[]>> {
      return call<MinedBlock[]>('getminedblocks', { address });
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
    tokentx(
      address?: string,
      contractaddress?: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
      filter?: AdvancedFilter,
    ): Promise<EtherscanResponse<Erc20Transfer[]>> {
      return tokenTransfers<Erc20Transfer[]>('tokentx', address, contractaddress, startblock, endblock, page, offset, sort, filter);
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
    tokennfttx(
      address?: string,
      contractaddress?: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
      filter?: AdvancedFilter,
    ): Promise<EtherscanResponse<Erc721Transfer[]>> {
      return tokenTransfers<Erc721Transfer[]>('tokennfttx', address, contractaddress, startblock, endblock, page, offset, sort, filter);
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
    token1155tx(
      address?: string,
      contractaddress?: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
      filter?: AdvancedFilter,
    ): Promise<EtherscanResponse<Erc1155Transfer[]>> {
      return tokenTransfers<Erc1155Transfer[]>('token1155tx', address, contractaddress, startblock, endblock, page, offset, sort, filter);
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
    fundedby(address: string): Promise<EtherscanResponse> {
      return call('fundedby', { address });
    },

    /**
     * Get the list of Plasma bridge deposit transactions received by an address
     * (Polygon, Gnosis and BitTorrent Chain).
     * @param address - Account address
     * @param page - Page number
     * @param offset - Max records to return
     */
    txnbridge(address: string, page?: number, offset?: number): Promise<EtherscanResponse> {
      return call('txnbridge', { address, page: page ?? 1, offset: offset ?? 100 });
    },
  };
}
