import type { RequestContext } from './get-request.js';
import { compact } from './params.js';
import type { EtherscanResponse } from './types.js';
import type { EventLog } from './results.js';

export function log(ctx: RequestContext) {
  const { list } = ctx.module('logs');

  return {
    /**
     * The Event Log API — an alternative to the native `eth_getLogs`. Only the
     * arguments you provide are sent.
     * @param address - Address to filter logs by
     * @param fromBlock - From block
     * @param toBlock - To block
     * @param topic0 - Topic 0 (32 bytes)
     * @param topic0_1_opr - and|or operator between topic0 \& topic1
     * @param topic1 - Topic 1 (32 bytes)
     * @param topic1_2_opr - and|or operator between topic1 \& topic2
     * @param topic2 - Topic 2 (32 bytes)
     * @param topic2_3_opr - and|or operator between topic2 \& topic3
     * @param topic3 - Topic 3 (32 bytes)
     * @param topic0_2_opr - and|or operator between topic0 \& topic2
     * @param page - Page number
     * @param offset - Max records to return
     * @param topic0_3_opr - and|or operator between topic0 \& topic3
     * @param topic1_3_opr - and|or operator between topic1 \& topic3
     * @see https://docs.etherscan.io/api-endpoints/logs
     */
    getLogs(
      address?: string,
      fromBlock?: string | number,
      toBlock?: string | number,
      topic0?: string,
      topic0_1_opr?: string,
      topic1?: string,
      topic1_2_opr?: string,
      topic2?: string,
      topic2_3_opr?: string,
      topic3?: string,
      topic0_2_opr?: string,
      page?: number,
      offset?: number,
      topic0_3_opr?: string,
      topic1_3_opr?: string,
    ): Promise<EtherscanResponse<EventLog[]>> {
      const params = compact({
        address,
        fromBlock,
        toBlock,
        topic0,
        topic0_1_opr,
        topic1,
        topic1_2_opr,
        topic2,
        topic2_3_opr,
        topic0_2_opr,
        topic0_3_opr,
        topic1_3_opr,
        topic3,
        page,
        offset,
      });
      return list<EventLog[]>('getLogs', params);
    },
  };
}
