import type { RequestContext } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type { ExecutionStatus, ReceiptStatus } from './results.js';

export function transaction(ctx: RequestContext) {
  const { call } = ctx.module('transaction');

  return {
    /**
     * Returns the contract-execution status of a transaction (was the tx itself
     * an error).
     * @param txhash - Transaction hash
     */
    getstatus(txhash: string): Promise<EtherscanResponse<ExecutionStatus>> {
      return call<ExecutionStatus>('getstatus', { txhash });
    },

    /**
     * Returns the receipt status of a transaction (only for post-Byzantium blocks).
     * @param txhash - Transaction hash
     */
    gettxreceiptstatus(txhash: string): Promise<EtherscanResponse<ReceiptStatus>> {
      return call<ReceiptStatus>('gettxreceiptstatus', { txhash });
    },
  };
}
