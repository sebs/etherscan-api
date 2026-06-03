import type { GetRequest } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type { ExecutionStatus, ReceiptStatus } from './results.js';

export function transaction(getRequest: GetRequest) {
  return {
    /**
     * Returns the contract-execution status of a transaction (was the tx itself
     * an error).
     * @param txhash - Transaction hash
     */
    getstatus(txhash: string): Promise<EtherscanResponse<ExecutionStatus>> {
      return getRequest<ExecutionStatus>({ module: 'transaction', action: 'getstatus', txhash });
    },

    /**
     * Returns the receipt status of a transaction (only for post-Byzantium blocks).
     * @param txhash - Transaction hash
     */
    gettxreceiptstatus(txhash: string): Promise<EtherscanResponse<ReceiptStatus>> {
      return getRequest<ReceiptStatus>({ module: 'transaction', action: 'gettxreceiptstatus', txhash });
    },
  };
}
