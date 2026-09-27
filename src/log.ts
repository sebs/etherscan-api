import type { RequestContext } from './get-request.js';
import { compact, isOptions } from './params.js';
import { pagingParams } from './list-params.js';
import type { EtherscanResponse } from './types.js';
import type { EventLog } from './results.js';

/** An `and`/`or` operator between two topics. */
export type TopicOperator = 'and' | 'or';

/**
 * Query for `log.getLogs`. Only the fields you set are sent.
 * @see https://docs.etherscan.io/api-endpoints/logs
 */
export interface LogQuery {
  /** Address to filter logs by. */
  address?: string;
  /** From block. */
  fromBlock?: string | number;
  /** To block. */
  toBlock?: string | number;
  /** Topic 0 (32 bytes). */
  topic0?: string;
  /** Topic 1 (32 bytes). */
  topic1?: string;
  /** Topic 2 (32 bytes). */
  topic2?: string;
  /** Topic 3 (32 bytes). */
  topic3?: string;
  /** Operator between topic0 and topic1. */
  topic0_1_opr?: TopicOperator;
  /** Operator between topic0 and topic2. */
  topic0_2_opr?: TopicOperator;
  /** Operator between topic0 and topic3. */
  topic0_3_opr?: TopicOperator;
  /** Operator between topic1 and topic2. */
  topic1_2_opr?: TopicOperator;
  /** Operator between topic1 and topic3. */
  topic1_3_opr?: TopicOperator;
  /** Operator between topic2 and topic3. */
  topic2_3_opr?: TopicOperator;
  /** Page number, from 1. */
  page?: number;
  /** Max records to return. */
  offset?: number;
}

/** The arguments after `address` of the deprecated positional `getLogs` form, in their historical order. */
export type PositionalLogArgs = [
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
];

export function log(ctx: RequestContext) {
  const { list } = ctx.module('logs');

  // Overloads: the public docs are on `getLogs` in the returned object below.
  /** Event logs matching a query. */
  function getLogs(query: LogQuery): Promise<EtherscanResponse<EventLog[]>>;
  /** @deprecated Pass a {@link LogQuery} object. */
  function getLogs(address?: string, ...rest: PositionalLogArgs): Promise<EtherscanResponse<EventLog[]>>;
  async function getLogs(first?: string | LogQuery, ...rest: PositionalLogArgs): Promise<EtherscanResponse<EventLog[]>> {
    let query: LogQuery;
    if (isOptions<LogQuery>(first)) {
      query = first;
    } else {
      const [fromBlock, toBlock, topic0, topic0_1_opr, topic1, topic1_2_opr, topic2, topic2_3_opr, topic3, topic0_2_opr, page, offset, topic0_3_opr, topic1_3_opr] = rest;
      query = {
        address: first, fromBlock, toBlock, topic0, topic1, topic2, topic3, page, offset,
        topic0_1_opr, topic0_2_opr, topic0_3_opr, topic1_2_opr, topic1_3_opr, topic2_3_opr,
      } as LogQuery;
    }
    const { page, offset, ...filters } = query;
    return list<EventLog[]>('getLogs', { ...compact({ ...filters }), ...pagingParams(page, offset) });
  }

  return {
    /**
     * The Event Log API — an alternative to the native `eth_getLogs`. Only the
     * fields you set are sent.
     * @param query - {@link LogQuery}: address, block range, topics, topic operators and paging
     * @example
     * api.log.getLogs({
     *   address: '0x33990122638b9132ca29c723bdf037f1c891a925',
     *   fromBlock: 379224,
     *   toBlock: 400000,
     *   topic0: '0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545',
     * });
     * @see https://docs.etherscan.io/api-endpoints/logs
     */
    getLogs,
  };
}
