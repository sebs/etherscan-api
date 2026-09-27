import { compact, isOptions } from './params.js';
import type { RequestContext } from './get-request.js';
import { EtherscanArgumentError } from './errors.js';
import { blockRange, filterParams, fromPositional, listParams, pagingParams } from './list-params.js';
import type {
  AdvancedFilter,
  FilteredListOptions,
  ListOptions,
  PositionalFilteredList,
  PositionalList,
} from './list-params.js';
import { checkAddressCount, checkSort } from './validation.js';
import type { SortOrder } from './validation.js';
import type { EtherscanResponse } from './types.js';
import type {
  MultiBalanceItem,
  NormalTransaction,
  InternalTransaction,
  Erc20Transfer,
  Erc721Transfer,
  Erc1155Transfer,
  MinedBlock,
  FundedBy,
  BeaconWithdrawal,
  L2Deposit,
  L2Withdrawal,
  PlasmaDeposit,
} from './results.js';

/** Options for the token-transfer lists: {@link FilteredListOptions} plus the token contract. */
export interface TokenTransferOptions extends FilteredListOptions {
  /** Token contract address; omit for all tokens. */
  contractaddress?: string;
}

/** Query for `txlistinternal`: one transaction's internal transactions, or an address's. */
export interface InternalTxQuery extends FilteredListOptions {
  /** Transaction hash. When given, `address` and the block range are ignored. */
  txhash?: string;
  /** Account address. */
  address?: string;
}

/**
 * A token-transfer list method (`tokentx`, `tokennfttx`, `token1155tx`):
 * `(address, options?)`, where `address` may be `undefined` when
 * `options.filter` selects by sender/recipient instead.
 */
export interface TokenTransferList<T> {
  (address: string | undefined, options?: TokenTransferOptions): Promise<EtherscanResponse<T[]>>;
  /** @deprecated Pass the list arguments as a {@link TokenTransferOptions} object. */
  (address: string | undefined, contractaddress?: string, ...list: PositionalFilteredList): Promise<EtherscanResponse<T[]>>;
}

/**
 * An address-scoped paged list method (`txsBeaconWithdrawal`, `getdeposittxs`,
 * `getwithdrawaltxs`): `(address, options?)`.
 */
export interface AddressList<T> {
  (address: string, options?: ListOptions): Promise<EtherscanResponse<T[]>>;
  /** @deprecated Pass the list arguments as a {@link ListOptions} object. */
  (address: string, ...list: PositionalList): Promise<EtherscanResponse<T[]>>;
}

/** Etherscan's `balancemulti` accepts at most 20 addresses per call. */
const MAX_BALANCEMULTI = 20;

export function account(ctx: RequestContext) {
  const { call, list } = ctx.module('account');

  // One body for the ERC-20/721/1155 token-transfer lists, which differ only
  // by action and result type.
  const tokenTransfers = <T>(action: string): TokenTransferList<T> =>
    (async (address?: string, ...args: [TokenTransferOptions?] | [string?, ...PositionalFilteredList]) => {
      const [first] = args;
      const options: TokenTransferOptions = isOptions<TokenTransferOptions>(first)
        ? first
        : { contractaddress: first, ...fromPositional(args.slice(1) as PositionalFilteredList) };
      return list<T[]>(action, { ...compact({ address, contractaddress: options.contractaddress }), ...listParams(options) });
    }) as TokenTransferList<T>;

  // One body for the address-scoped paged lists (beacon withdrawals and the
  // L2 deposit/withdrawal lists), which differ only by action.
  const addressList = <T>(action: string): AddressList<T> =>
    (async (address: string, ...args: [ListOptions?] | PositionalList) => {
      const [first] = args;
      const options = isOptions<ListOptions>(first) ? first : fromPositional(args as PositionalList);
      return list<T[]>(action, { address, ...listParams(options) });
    }) as AddressList<T>;

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
  function txlist(address: string, options?: FilteredListOptions): Promise<EtherscanResponse<NormalTransaction[]>>;
  /** Transactions matching an advanced filter (Beta) instead of an address. */
  function txlist(
    address: undefined,
    options: FilteredListOptions & { filter: AdvancedFilter },
  ): Promise<EtherscanResponse<NormalTransaction[]>>;
  /** @deprecated Pass the list arguments as a {@link FilteredListOptions} object. */
  function txlist(address: string, ...list: PositionalFilteredList): Promise<EtherscanResponse<NormalTransaction[]>>;
  /** @deprecated Pass the list arguments as a {@link FilteredListOptions} object. */
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
    ...args: [FilteredListOptions?] | PositionalFilteredList
  ): Promise<EtherscanResponse<NormalTransaction[]>> {
    const [first] = args;
    const options = isOptions<FilteredListOptions>(first) ? first : fromPositional(args as PositionalFilteredList);
    // Without an address or a from/to filter, the request can only fail at Etherscan.
    if (!address && !options.filter?.from && !options.filter?.to) {
      throw new EtherscanArgumentError('txlist() needs an address or an advanced filter with from/to', 'address');
    }
    return list<NormalTransaction[]>('txlist', { ...compact({ address }), ...listParams(options) });
  }

  // Overloads: the public docs are on `txlistinternal` in the returned object below.
  /** Internal transactions of one transaction, an address, or an advanced filter. */
  function txlistinternal(query: InternalTxQuery): Promise<EtherscanResponse<InternalTransaction[]>>;
  /** @deprecated Pass an {@link InternalTxQuery} object. */
  function txlistinternal(
    txhash?: string,
    address?: string,
    startblock?: string | number,
    endblock?: string | number,
    sort?: SortOrder,
    filter?: AdvancedFilter,
    page?: number,
    offset?: number,
  ): Promise<EtherscanResponse<InternalTransaction[]>>;
  async function txlistinternal(
    first?: string | InternalTxQuery,
    address?: string,
    startblock?: string | number,
    endblock?: string | number,
    sort?: SortOrder,
    filter?: AdvancedFilter,
    page?: number,
    offset?: number,
  ): Promise<EtherscanResponse<InternalTransaction[]>> {
    const query: InternalTxQuery = isOptions<InternalTxQuery>(first)
      ? first
      : { txhash: first, address, startblock, endblock, sort, filter, page, offset };
    return list<InternalTransaction[]>('txlistinternal', {
      ...compact(
        query.txhash ? { txhash: query.txhash } : { address: query.address, ...blockRange(query.startblock, query.endblock) },
      ),
      // No paging defaults here, unlike the other lists: callers who never
      // paged keep getting Etherscan's full (unpaged) result.
      ...pagingParams(query.page, query.offset),
      sort: checkSort(query.sort),
      ...filterParams(query.filter),
    });
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
     * Get the internal transactions of one transaction (`txhash`), of an
     * address, or matching an advanced filter (Beta). Paging is sent only when
     * given; without it Etherscan returns the unpaged result.
     * @param query - {@link InternalTxQuery}: `txhash`, or `address` / `filter` plus {@link ListOptions}
     * @example
     * api.account.txlistinternal({ txhash: '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170' });
     * api.account.txlistinternal({ address: '0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3', page: 1, offset: 50 });
     */
    txlistinternal,

    /**
     * Get a list of normal transactions for an address, or for an advanced
     * filter (Beta) on `from`/`to` when `address` is `undefined`.
     * @param address - Account address (`undefined` when filtering with `options.filter`)
     * @param options - {@link FilteredListOptions}: block range, paging, sort and filter
     * @example
     * api.account.txlist('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', { page: 1, offset: 100, sort: 'desc' });
     * api.account.txlist(undefined, { filter: { from: '0xde0b…', to: '0x63a9…', fromto_opr: 'and' } });
     */
    txlist,

    /**
     * Get a list of blocks that a specific account has mined. Paging is sent
     * only when given.
     * @param address - Account address
     * @param blocktype - `'blocks'` for canonical blocks or `'uncles'` for uncles (Etherscan defaults to blocks)
     * @param page - Page number
     * @param offset - Max records to return
     * @example
     * api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b', 'uncles', 1, 10);
     */
    async getminedblocks(
      address: string,
      blocktype?: 'blocks' | 'uncles',
      page?: number,
      offset?: number,
    ): Promise<EtherscanResponse<MinedBlock[]>> {
      return list<MinedBlock[]>('getminedblocks', {
        ...compact({ address, blocktype }),
        ...pagingParams(page, offset, { window: false }),
      });
    },

    /**
     * Get a list of "ERC20 - Token Transfer Events" by address.
     * @param address - Account address (`undefined` when filtering with `options.filter`)
     * @param options - {@link TokenTransferOptions}: token contract, block range, paging, sort and filter
     * @example
     * api.account.tokentx('0xde0b…', { contractaddress: '0x6b175474e89094c44da98b954eedeac495271d0f' });
     */
    tokentx: tokenTransfers<Erc20Transfer>('tokentx'),

    /**
     * Get a list of "ERC721 - Token Transfer Events" by address.
     * @param address - Account address (`undefined` when filtering with `options.filter`)
     * @param options - {@link TokenTransferOptions}: token contract, block range, paging, sort and filter
     */
    tokennfttx: tokenTransfers<Erc721Transfer>('tokennfttx'),

    /**
     * Get a list of "ERC1155 - Token Transfer Events" by address.
     * @param address - Account address (`undefined` when filtering with `options.filter`)
     * @param options - {@link TokenTransferOptions}: token contract, block range, paging, sort and filter
     */
    token1155tx: tokenTransfers<Erc1155Transfer>('token1155tx'),

    /**
     * Get the beacon chain withdrawals made to an address.
     * @param address - Account address
     * @param options - {@link ListOptions}: block range, paging and sort
     */
    txsBeaconWithdrawal: addressList<BeaconWithdrawal>('txsBeaconWithdrawal'),

    /**
     * Get the list of L2 deposit transactions for an address.
     * @param address - Account address
     * @param options - {@link ListOptions}: block range, paging and sort
     */
    getdeposittxs: addressList<L2Deposit>('getdeposittxs'),

    /**
     * Get the list of L2 withdrawal transactions for an address.
     * @param address - Account address
     * @param options - {@link ListOptions}: block range, paging and sort
     */
    getwithdrawaltxs: addressList<L2Withdrawal>('getwithdrawaltxs'),

    /**
     * Returns the address that first funded a given address.
     * @param address - Account address
     */
    fundedby(address: string): Promise<EtherscanResponse<FundedBy>> {
      return call<FundedBy>('fundedby', { address });
    },

    /**
     * Get the list of Plasma bridge deposit transactions received by an address
     * (Polygon, Gnosis and BitTorrent Chain).
     * @param address - Account address
     * @param page - Page number (default 1)
     * @param offset - Max records to return (default 100)
     */
    async txnbridge(address: string, page?: number, offset?: number): Promise<EtherscanResponse<PlasmaDeposit[]>> {
      return list<PlasmaDeposit[]>('txnbridge', { address, ...pagingParams(page, offset, { defaults: true, window: false }) });
    },
  };
}
