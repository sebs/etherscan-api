import type { RequestContext } from './get-request.js';
import { isoDate } from './validation.js';
import type { SortOrder } from './validation.js';
import { EtherscanArgumentError } from './errors.js';
import type { EtherscanResponse } from './types.js';
import type { EthPrice, EthSupply2, NodeCount, ChainSize } from './results.js';

export function stats(ctx: RequestContext) {
  const { call, list } = ctx.module('stats');

  async function tokensupply(tokenname: string | null | undefined, contractaddress: string): Promise<EtherscanResponse<string>> {
    void tokenname; // Deprecated: Etherscan V2 no longer looks a token up by name.
    if (!contractaddress) {
      throw new EtherscanArgumentError(
        'tokensupply() needs the token contract address; Etherscan no longer looks tokens up by name',
        'contractaddress',
      );
    }
    return call<string>('tokensupply', { contractaddress });
  }

  return {
    /**
     * Returns the supply of a token, identified by its contract address.
     * @param tokenname - Deprecated and ignored: Etherscan V2 no longer looks a
     *   token up by name. Pass `null`.
     * @param contractaddress - Token contract address (required)
     * @example
     * api.stats.tokensupply(null, '0x57d90b64a1a57749b0f932f1a3395792e12e7055');
     */
    tokensupply,

    /** Returns the total supply of ether. */
    ethsupply(): Promise<EtherscanResponse<string>> {
      return call<string>('ethsupply');
    },

    /** Returns the total supply of ether including Eth2 staking and burnt fees. */
    ethsupply2(): Promise<EtherscanResponse<EthSupply2>> {
      return call<EthSupply2>('ethsupply2');
    },

    /** Returns the total number of discoverable nodes on the network. */
    nodecount(): Promise<EtherscanResponse<NodeCount>> {
      return call<NodeCount>('nodecount');
    },

    /** Returns the current ether price. */
    ethprice(): Promise<EtherscanResponse<EthPrice>> {
      return call<EthPrice>('ethprice');
    },

    /**
     * Returns the size of the blockchain, in bytes, sampled daily over a date range.
     * @param startdate - Start date, `YYYY-MM-DD` or a `Date` (taken in UTC)
     * @param enddate - End date, `YYYY-MM-DD` or a `Date` (taken in UTC)
     * @param clienttype - Node client to measure: `'geth'` (default) or `'parity'`
     * @param syncmode - Sync mode: `'default'` (default) or `'archive'`
     * @param sort - Sort asc/desc (default `'asc'`)
     * @example
     * api.stats.chainsize('2019-02-01', '2019-02-28');
     */
    async chainsize(
      startdate: string | Date,
      enddate: string | Date,
      clienttype: 'geth' | 'parity' = 'geth',
      syncmode: 'default' | 'archive' = 'default',
      sort: SortOrder = 'asc',
    ): Promise<EtherscanResponse<ChainSize[]>> {
      return list<ChainSize[]>('chainsize', {
        startdate: isoDate('startdate', startdate),
        enddate: isoDate('enddate', enddate),
        clienttype,
        syncmode,
        sort,
      });
    },
  };
}
