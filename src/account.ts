import { compact } from './params.js';
import type { RequestContext } from './get-request.js';
import { EtherscanArgumentError } from './errors.js';
import { checkAddressCount, checkPaging, checkSort } from './validation.js';
import type { SortOrder } from './validation.js';
import type { QueryParams } from './params.js';
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
  Object.assign(params, compact({ from: filter.from, to: filter.to, fromto_opr: filter.fromto_opr }));
}

/**
 * Apply the shared start/end block, paging and sort defaults to a params object
 * (the block repeated by the paged list endpoints), validating paging and sort.
 * @throws {Error} For an invalid sort or paging combination.
 */
function listRange(
  params: QueryParams,
  startblock?: string | number,
  endblock?: string | number,
  page?: number,
  offset?: number,
  sort?: SortOrder,
): void {
  params.startblock = startblock ?? 0;
  params.endblock = endblock ?? 'latest';
  params.page = page ?? 1;
  params.offset = offset ?? 100;
  checkPaging(params.page, params.offset);
  params.sort = checkSort(sort);
}

/** Etherscan's `balancemulti` accepts at most 20 addresses per call. */
const MAX_BALANCEMULTI = 20;

export function account(ctx: RequestContext) {
  const { call, list } = ctx.module('account');

  // Shared body for the ERC-20/721/1155 token-transfer endpoints, which differ
  // only by action string and result type. Kept private; the public methods
  // below preserve their own signatures, JSDoc and result generics.
  // async: a validation error from listRange becomes a rejection, not a throw.
  async function tokenTransfers<T>(
    action: string,
    address?: string,
    contractaddress?: string,
    startblock?: string | number,
    endblock?: string | number,
    page?: number,
    offset?: number,
    sort?: SortOrder,
    filter?: AdvancedFilter,
  ): Promise<EtherscanResponse<T>> {
    const params = compact({ address, contractaddress });
    listRange(params, startblock, endblock, page, offset, sort);
    applyFilter(params, filter);
    return list<T>(action, params);
  }

  // Shared body for the address-scoped paged list endpoints (beacon withdrawals
  // and the L2 deposit/withdrawal lists), which differ only by action string.
  const pagedByAddress =
    (action: string) =>
    async (
      address: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: SortOrder,
    ): Promise<EtherscanResponse> => {
      const params: QueryParams = { address };
      listRange(params, startblock, endblock, page, offset, sort);
      return list(action, params);
    };

  // Overloads: the public docs are on `balance` in the returned object below,
  // which is where TypeDoc reads them.
  /** One account: the balance in wei, as a string. */
  function balance(address: string): Promise<EtherscanResponse<string>>;
  /** 1 to 20 accounts (`balancemulti`): one `{ account, balance }` per address. */
  function balance(address: string[]): Promise<EtherscanResponse<MultiBalanceItem[]>>;
  /** Either form. */
  function balance(address: string | string[]): Promise<EtherscanResponse<string | MultiBalanceItem[]>>;
  async function balance(address: string | string[]): Promise<EtherscanResponse<string | MultiBalanceItem[]>> {
    let action = 'balance';
    let addr: string;
    if (Array.isArray(address)) {
      checkAddressCount('balance', address, MAX_BALANCEMULTI);
      addr = address.join(',');
      action = 'balancemulti';
    } else {
      // A comma-joined string would go to the single-address action (and the
      // string-typed overload), skipping the balancemulti limit; require an array.
      if (address.includes(',')) {
        throw new EtherscanArgumentError(
          'balance() takes one address per string; pass an array for several addresses',
          'address',
          address,
        );
      }
      addr = address;
    }
    return call<string | MultiBalanceItem[]>(action, { tag: 'latest', address: addr });
  }

  // Overloads: the public docs are on `txlist` in the returned object below.
  /** Transactions of an address. */
  function txlist(
    address: string,
    startblock?: string | number,
    endblock?: string | number,
    page?: number,
    offset?: number,
    sort?: SortOrder,
    filter?: AdvancedFilter,
  ): Promise<EtherscanResponse<NormalTransaction[]>>;
  /** Transactions matching an advanced filter (Beta) instead of an address. */
  function txlist(
    address: undefined,
    startblock: string | number | undefined,
    endblock: string | number | undefined,
    page: number | undefined,
    offset: number | undefined,
    sort: SortOrder | undefined,
    filter: AdvancedFilter,
  ): Promise<EtherscanResponse<NormalTransaction[]>>;
  async function txlist(
    address?: string,
    startblock?: string | number,
    endblock?: string | number,
    page?: number,
    offset?: number,
    sort?: SortOrder,
    filter?: AdvancedFilter,
  ): Promise<EtherscanResponse<NormalTransaction[]>> {
    // Without an address or a from/to filter, the request can only fail at Etherscan.
    if (!address && !filter?.from && !filter?.to) {
      throw new EtherscanArgumentError('txlist() needs an address or an advanced filter with from/to', 'address');
    }
    const params = compact({ address });
    listRange(params, startblock, endblock, page, offset, sort);
    applyFilter(params, filter);
    return list<NormalTransaction[]>('txlist', params);
  }

  return {
    /**
     * Returns the balance (wei, as a string) of one account, or the balances
     * of several when given an array (the `balancemulti` action).
     * @param address - An address, or an array of 1 to 20 addresses
     * @example
     * api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
     * api.account.balance(['0xde0b…', '0x63a9…']); // → { account, balance }[]
     */
    balance,

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
    tokenbalance(address: string, tokenname?: string, contractaddress?: string): Promise<EtherscanResponse<string>> {
      return call<string>('tokenbalance', compact({ tag: 'latest', contractaddress, tokenname, address }));
    },

    /**
     * Get a list of internal transactions.
     * @param txhash - Transaction hash. If specified then `address` is ignored
     * @param address - Account address
     * @param startblock - Start block
     * @param endblock - End block
     * @param sort - Sort asc/desc
     * @param filter - Optional advanced filter (Beta): filter by `from`/`to` instead of `address`
     * @param page - Page number (sent only when given)
     * @param offset - Max records to return (sent only when given)
     * @example
     * api.account.txlistinternal('0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170');
     */
    async txlistinternal(
      txhash?: string,
      address?: string,
      startblock?: string | number,
      endblock?: string | number,
      sort?: SortOrder,
      filter?: AdvancedFilter,
      page?: number,
      offset?: number,
    ): Promise<EtherscanResponse<InternalTransaction[]>> {
      // No paging defaults here, unlike listRange: callers who never paged
      // keep getting Etherscan's full (unpaged) result. What is given is
      // still validated.
      if (page !== undefined || offset !== undefined) {
        checkPaging(page ?? 1, offset ?? 1);
      }
      const params = compact({
        sort: checkSort(sort),
        ...(txhash ? { txhash } : { address, startblock: startblock ?? 0, endblock: endblock ?? 'latest' }),
        page,
        offset,
      });
      applyFilter(params, filter);
      return list<InternalTransaction[]>('txlistinternal', params);
    },

    /**
     * Get a list of normal transactions for an address, or for an advanced
     * filter (Beta) on `from`/`to` when `address` is `undefined`.
     * @param address - Account address (`undefined` when filtering with `filter`)
     * @param startblock - Start block
     * @param endblock - End block
     * @param page - Page number
     * @param offset - Max records to return
     * @param sort - Sort asc/desc
     * @param filter - Optional advanced filter (Beta) by `from`/`to`; required without an address
     * @example
     * api.account.txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', 1, 'latest', 1, 100, 'asc');
     */
    txlist,

    /**
     * Get a list of blocks that a specific account has mined.
     * @param address - Account address
     * @param blocktype - `'blocks'` for canonical blocks or `'uncles'` for uncles (Etherscan defaults to blocks)
     * @param page - Page number
     * @param offset - Max records to return
     * @example
     * api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b', 'uncles', 1, 10);
     */
    getminedblocks(
      address: string,
      blocktype?: 'blocks' | 'uncles',
      page?: number,
      offset?: number,
    ): Promise<EtherscanResponse<MinedBlock[]>> {
      return list<MinedBlock[]>('getminedblocks', compact({ address, blocktype, page, offset }));
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
      sort?: SortOrder,
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
      sort?: SortOrder,
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
      sort?: SortOrder,
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
      return list('txnbridge', { address, page: page ?? 1, offset: offset ?? 100 });
    },
  };
}
