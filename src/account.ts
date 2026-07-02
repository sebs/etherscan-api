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

export function account(getRequest: GetRequest) {
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
      const params: QueryParams = { module: 'account', action: 'tokenbalance', tag: 'latest' };
      if (contractaddress) {
        params.contractaddress = contractaddress;
      }
      if (tokenname) {
        params.tokenname = tokenname;
      }
      if (address) {
        params.address = address;
      }
      return getRequest<string>(params);
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
      return getRequest<string | MultiBalanceItem[]>({ module: 'account', action, tag: 'latest', address: addr });
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
      const params: QueryParams = { module: 'account', action: 'txlistinternal' };
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
      return getRequest<InternalTransaction[]>(params);
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
      const params: QueryParams = {
        module: 'account',
        action: 'txlist',
        startblock: startblock ?? 0,
        endblock: endblock ?? 'latest',
        page: page ?? 1,
        offset: offset ?? 100,
        sort: sort || 'asc',
      };
      if (address) {
        params.address = address;
      }
      applyFilter(params, filter);
      return getRequest<NormalTransaction[]>(params);
    },

    /**
     * Get a list of blocks that a specific account has mined.
     * @param address - Account address
     * @example
     * api.account.getminedblocks('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b');
     */
    getminedblocks(address: string): Promise<EtherscanResponse<MinedBlock[]>> {
      return getRequest<MinedBlock[]>({ module: 'account', action: 'getminedblocks', address });
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
      const params: QueryParams = {
        module: 'account',
        action: 'tokentx',
        startblock: startblock ?? 0,
        endblock: endblock ?? 'latest',
        page: page ?? 1,
        offset: offset ?? 100,
        sort: sort || 'asc',
      };
      if (address) {
        params.address = address;
      }
      if (contractaddress) {
        params.contractaddress = contractaddress;
      }
      applyFilter(params, filter);
      return getRequest<Erc20Transfer[]>(params);
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
      const params: QueryParams = {
        module: 'account',
        action: 'tokennfttx',
        startblock: startblock ?? 0,
        endblock: endblock ?? 'latest',
        page: page ?? 1,
        offset: offset ?? 100,
        sort: sort || 'asc',
      };
      if (address) {
        params.address = address;
      }
      if (contractaddress) {
        params.contractaddress = contractaddress;
      }
      applyFilter(params, filter);
      return getRequest<Erc721Transfer[]>(params);
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
      const params: QueryParams = {
        module: 'account',
        action: 'token1155tx',
        startblock: startblock ?? 0,
        endblock: endblock ?? 'latest',
        page: page ?? 1,
        offset: offset ?? 100,
        sort: sort || 'asc',
      };
      if (address) {
        params.address = address;
      }
      if (contractaddress) {
        params.contractaddress = contractaddress;
      }
      applyFilter(params, filter);
      return getRequest<Erc1155Transfer[]>(params);
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
    txsBeaconWithdrawal(
      address: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
    ): Promise<EtherscanResponse> {
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
    getdeposittxs(
      address: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
    ): Promise<EtherscanResponse> {
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
    getwithdrawaltxs(
      address: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
    ): Promise<EtherscanResponse> {
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
    fundedby(address: string): Promise<EtherscanResponse> {
      return getRequest({ module: 'account', action: 'fundedby', address });
    },

    /**
     * Get the list of Plasma bridge deposit transactions received by an address
     * (Polygon, Gnosis and BitTorrent Chain).
     * @param address - Account address
     * @param page - Page number
     * @param offset - Max records to return
     */
    txnbridge(address: string, page?: number, offset?: number): Promise<EtherscanResponse> {
      return getRequest({
        module: 'account',
        action: 'txnbridge',
        address,
        page: page ?? 1,
        offset: offset ?? 100,
      });
    },
  };
}
