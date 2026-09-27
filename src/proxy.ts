import type { GetRequest, QueryParams } from './get-request.js';
import type { EtherscanResponse } from './types.js';

/** A block number/index as JSON-RPC takes it: a hex quantity or a named tag. */
export type BlockTag = string | number;

/**
 * Convert a block number or index to a JSON-RPC quantity. JSON-RPC takes hex
 * (`0x7b`), but every other namespace here takes decimal block numbers, so a
 * number or an all-digit string is converted. Named tags (`'latest'`,
 * `'pending'`, `'earliest'`) and `0x` values pass through unchanged.
 */
function toQuantity(value: BlockTag): string {
  if (typeof value === 'number' || /^\d+$/.test(value)) {
    const n = Number(value);
    if (!Number.isSafeInteger(n) || n < 0) {
      throw new Error(`Invalid block number or index ${String(value)}: expected a non-negative integer`);
    }
    return '0x' + n.toString(16);
  }
  return value;
}

export function proxy(getRequest: GetRequest) {
  // Bind module:'proxy' once; every method names only its action and params.
  const call = <T = unknown>(action: string, params: QueryParams = {}) =>
    getRequest<T>({ module: 'proxy', action, ...params });

  return {
    /** Returns the number of the most recent block (hex). */
    eth_blockNumber(): Promise<EtherscanResponse<string>> {
      return call<string>('eth_blockNumber');
    },

    /**
     * Returns information about a block by block number.
     * @param tag - Block number (decimal number/string, converted to hex), a hex tag such as
     *   `'0x10d4f'`, or `'latest'` / `'pending'` / `'earliest'`
     * @param fullTransactions - When true (default) returns full transaction objects, otherwise only hashes
     */
    async eth_getBlockByNumber(tag: BlockTag, fullTransactions = true): Promise<EtherscanResponse> {
      return call('eth_getBlockByNumber', { tag: toQuantity(tag), boolean: fullTransactions });
    },

    /**
     * Returns information about an uncle by block number and index.
     * @param tag - Block number tag
     * @param index - Uncle index position
     */
    async eth_getUncleByBlockNumberAndIndex(tag: BlockTag, index: BlockTag): Promise<EtherscanResponse> {
      return call('eth_getUncleByBlockNumberAndIndex', { tag: toQuantity(tag), index: toQuantity(index) });
    },

    /**
     * Returns the number of transactions in a block matching the given block number (hex).
     * @param tag - Block number tag
     */
    async eth_getBlockTransactionCountByNumber(tag: BlockTag): Promise<EtherscanResponse<string>> {
      return call<string>('eth_getBlockTransactionCountByNumber', { tag: toQuantity(tag) });
    },

    /**
     * Returns information about a transaction by hash.
     * @param txhash - Transaction hash
     */
    eth_getTransactionByHash(txhash: string): Promise<EtherscanResponse> {
      return call('eth_getTransactionByHash', { txhash });
    },

    /**
     * Returns information about a transaction by block number and index.
     * @param tag - Block number tag
     * @param index - Transaction index position
     */
    async eth_getTransactionByBlockNumberAndIndex(tag: BlockTag, index: BlockTag): Promise<EtherscanResponse> {
      return call('eth_getTransactionByBlockNumberAndIndex', { tag: toQuantity(tag), index: toQuantity(index) });
    },

    /**
     * Returns the number of transactions sent from an address (hex).
     * @param address - Account address
     * @param tag - Block parameter: `'latest'`, `'pending'` (the next nonce to use) or `'earliest'`;
     *   Etherscan defaults to `'latest'` when omitted
     */
    async eth_getTransactionCount(address: string, tag?: BlockTag): Promise<EtherscanResponse<string>> {
      const params: QueryParams = { address };
      if (tag !== undefined && tag !== '') {
        params.tag = toQuantity(tag);
      }
      return call<string>('eth_getTransactionCount', params);
    },

    /**
     * Submits a pre-signed transaction for broadcast. Resolves with the tx hash.
     * @param hex - Serialized signed message
     */
    eth_sendRawTransaction(hex: string): Promise<EtherscanResponse<string>> {
      return call<string>('eth_sendRawTransaction', { hex });
    },

    /**
     * Returns the receipt of a transaction by hash.
     * @param txhash - Transaction hash
     */
    eth_getTransactionReceipt(txhash: string): Promise<EtherscanResponse> {
      return call('eth_getTransactionReceipt', { txhash });
    },

    /**
     * Executes a new message call immediately without creating a transaction (hex).
     * @param to - Address to execute against
     * @param data - Hash of the method signature and encoded parameters
     * @param tag - Block number tag
     */
    async eth_call(to: string, data: string, tag: BlockTag): Promise<EtherscanResponse<string>> {
      return call<string>('eth_call', { to, data, tag: toQuantity(tag) });
    },

    /**
     * Returns code at a given address (hex).
     * @param address - Address to get code from
     * @param tag - Block number tag
     */
    async eth_getCode(address: string, tag: BlockTag): Promise<EtherscanResponse<string>> {
      return call<string>('eth_getCode', { address, tag: toQuantity(tag) });
    },

    /**
     * Returns the value from a storage position at a given address (hex).
     * @param address - Address to get storage from
     * @param position - Storage position
     * @param tag - Block number tag
     */
    async eth_getStorageAt(address: string, position: string, tag: BlockTag): Promise<EtherscanResponse<string>> {
      return call<string>('eth_getStorageAt', { address, position, tag: toQuantity(tag) });
    },

    /** Returns the current price per gas in wei (hex). */
    eth_gasPrice(): Promise<EtherscanResponse<string>> {
      return call<string>('eth_gasPrice');
    },

    /**
     * Estimates the gas needed for a transaction without adding it to the chain (hex).
     * @param to - Address to interact with
     * @param value - Value sent in the transaction
     * @param gasPrice - Gas price in wei
     * @param gas - Gas provided
     * @param data - Call data (method signature hash plus encoded arguments), needed to
     *   estimate a contract call rather than a plain transfer
     */
    eth_estimateGas(
      to: string,
      value: string,
      gasPrice: string,
      gas: string,
      data?: string,
    ): Promise<EtherscanResponse<string>> {
      const params: QueryParams = { to, value, gasPrice, gas };
      if (data) {
        params.data = data;
      }
      return call<string>('eth_estimateGas', params);
    },
  };
}
