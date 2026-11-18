import type { RequestContext } from './get-request.js';
import { checkTxHash } from './validation.js';
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
    async getstatus(txhash: string): Promise<EtherscanResponse<ExecutionStatus>> {
      checkTxHash('txhash', txhash);
      return call<ExecutionStatus>('getstatus', { txhash });
    },

    /**
     * Returns the receipt status of a transaction (only for post-Byzantium blocks).
     * @param txhash - Transaction hash
     */
    async gettxreceiptstatus(txhash: string): Promise<EtherscanResponse<ReceiptStatus>> {
      checkTxHash('txhash', txhash);
      return call<ReceiptStatus>('gettxreceiptstatus', { txhash });
    },
  };
}
