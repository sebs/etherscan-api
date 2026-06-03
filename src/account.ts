import type { GetRequest, QueryParams } from './get-request.js';
import type { EtherscanResponse } from './types.js';

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
    tokenbalance(address?: string, tokenname?: string, contractaddress?: string): Promise<EtherscanResponse> {
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
      return getRequest(params);
    },

    /**
     * Returns the balance of a specific account, or several accounts when given
     * an array (uses the `balancemulti` action).
     * @param address - A single address, or an array of addresses
     * @example
     * api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
     */
    balance(address: string | string[]): Promise<EtherscanResponse> {
      let action = 'balance';
      let addr: string;
      if (Array.isArray(address)) {
        addr = address.join(',');
        action = 'balancemulti';
      } else {
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
    txlistinternal(
      txhash?: string,
      address?: string,
      startblock?: string | number,
      endblock?: string | number,
      sort?: string,
    ): Promise<EtherscanResponse> {
      const params: QueryParams = { module: 'account', action: 'txlistinternal' };
      params.sort = sort || 'asc';

      if (txhash) {
        params.txhash = txhash;
      } else {
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
    txlist(
      address: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
    ): Promise<EtherscanResponse> {
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
    getminedblocks(address: string): Promise<EtherscanResponse> {
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
    tokentx(
      address: string,
      contractaddress?: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
    ): Promise<EtherscanResponse> {
      const params: QueryParams = {
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
    tokennfttx(
      address: string,
      contractaddress?: string,
      startblock?: string | number,
      endblock?: string | number,
      page?: number,
      offset?: number,
      sort?: string,
    ): Promise<EtherscanResponse> {
      const params: QueryParams = {
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
  };
}
