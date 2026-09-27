import { forModule } from './get-request.js';
import type { RequestContext } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type { GasOracle } from './results.js';

export function gastracker(ctx: RequestContext) {
  const call = forModule(ctx.get, 'gastracker');

  return {
    /**
     * Returns the current Safe / Propose / Fast gas prices (in Gwei) along with
     * the suggested base fee and recent gas-used ratio.
     */
    gasoracle(): Promise<EtherscanResponse<GasOracle>> {
      return call<GasOracle>('gasoracle');
    },

    /**
     * Returns the estimated confirmation time, in seconds, for a transaction at
     * the given gas price.
     * @param gasprice - Gas price in wei
     */
    gasestimate(gasprice: string | number): Promise<EtherscanResponse<string>> {
      return call<string>('gasestimate', { gasprice });
    },
  };
}
