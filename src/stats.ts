import { emptyAsList } from './get-request.js';
import { forModule } from './get-request.js';
import type { RequestContext } from './get-request.js';
import { compact } from './params.js';
import type { EtherscanResponse } from './types.js';
import type { EthPrice, ChainSize } from './results.js';

export function stats(ctx: RequestContext) {
  const call = forModule(ctx.get, 'stats');

  /**
   * Returns the supply of a token, identified by its contract address.
   * @param tokenname - Name of the token (optional; pass `null`)
   * @param contractaddress - Token contract address
   * @example
   * api.stats.tokensupply(null, '0x57d90b64a1a57749b0f932f1a3395792e12e7055');
   */
  function tokensupply(tokenname: string | null | undefined, contractaddress: string): Promise<EtherscanResponse<string>>;
  /**
   * Returns the supply of a token, identified by its name.
   * @param tokenname - Name of the token
   */
  function tokensupply(tokenname: string, contractaddress?: string): Promise<EtherscanResponse<string>>;
  async function tokensupply(tokenname?: string | null, contractaddress?: string): Promise<EtherscanResponse<string>> {
    // With neither, the request can only fail at Etherscan.
    if (!tokenname && !contractaddress) {
      throw new Error('tokensupply() needs a token contract address or a token name');
    }
    return call<string>('tokensupply', compact({ tokenname, contractaddress }));
  }

  return {
    tokensupply,

    /** Returns the total supply of ether. */
    ethsupply(): Promise<EtherscanResponse<string>> {
      return call<string>('ethsupply');
    },

    /** Returns the total supply of ether including Eth2 staking and burnt fees. */
    ethsupply2(): Promise<EtherscanResponse<string>> {
      return call<string>('ethsupply2');
    },

    /** Returns the total number of discoverable nodes on the network. */
    nodecount(): Promise<EtherscanResponse<string>> {
      return call<string>('nodecount');
    },

    /** Returns the current ether price. */
    ethprice(): Promise<EtherscanResponse<EthPrice>> {
      return call<EthPrice>('ethprice');
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
    chainsize(
      startdate: string,
      enddate: string,
      clienttype: 'geth' | 'parity' = 'geth',
      syncmode: 'default' | 'archive' = 'default',
      sort: 'asc' | 'desc' = 'asc',
    ): Promise<EtherscanResponse<ChainSize[]>> {
      return emptyAsList(
        call<ChainSize[]>('chainsize', {
          startdate,
          enddate,
          clienttype,
          syncmode,
          sort,
        }),
      );
    },
  };
}
