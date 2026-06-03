import { EtherscanError } from './errors.js';
import type { EtherscanResponse, Transport } from './types.js';

/** Endpoint-specific query parameters supplied by a namespace method. */
export type QueryParams = Record<string, string | number | boolean>;

/** The shared request function handed to every namespace. */
export type GetRequest = (params: QueryParams) => Promise<EtherscanResponse>;

export interface GetRequestConfig {
  baseUrl: string;
  timeout: number;
}

/**
 * Builds the shared request function. Every namespace passes a plain params
 * object; this injects the universal `apikey` and `chainid`, serialises the
 * query, performs the GET via the supplied transport, and normalises the result.
 */
export function createGetRequest(
  request: Transport,
  defaults: Record<string, string | number>,
  config: GetRequestConfig,
): GetRequest {
  return function getRequest(params: QueryParams): Promise<EtherscanResponse> {
    const merged: Record<string, string> = {};
    for (const [key, value] of Object.entries({ ...params, ...defaults })) {
      merged[key] = String(value);
    }
    const query = new URLSearchParams(merged).toString();
    const url = config.baseUrl + '/v2/api?' + query;

    return Promise.resolve(request(url, { timeout: config.timeout })).then((data) => {
      // Standard REST endpoints report failure with status "0".
      // (JSON-RPC proxy endpoints have no `status` field — skip them here.)
      if (data.status !== undefined && String(data.status) !== '1') {
        let message = 'NOTOK';
        if (typeof data.result === 'string' && data.result) {
          message = data.result;
        } else if (typeof data.message === 'string' && data.message) {
          message = data.message;
        }
        throw new EtherscanError(message, { result: data.result, status: data.status });
      }

      // JSON-RPC proxy endpoints report failure with an `error` object/string.
      if (data.error) {
        let message = typeof data.error === 'string' ? data.error : 'Error';
        if (typeof data.error === 'object' && data.error !== null && 'message' in data.error) {
          message = String((data.error as { message: unknown }).message);
        }
        throw new EtherscanError(message, { result: data.error });
      }

      return data;
    });
  };
}
