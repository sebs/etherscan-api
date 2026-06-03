import { EtherscanError } from './errors.js';
import type { EtherscanResponse, Transport } from './types.js';

/** Endpoint-specific query parameters supplied by a namespace method. */
export type QueryParams = Record<string, string | number | boolean>;

/** The shared GET request function handed to every namespace. */
export interface GetRequest {
  <T = unknown>(params: QueryParams): Promise<EtherscanResponse<T>>;
}

/** A POST request function (used by the contract-verification endpoints). */
export interface PostRequest {
  <T = unknown>(params: QueryParams): Promise<EtherscanResponse<T>>;
}

/** A GET against an arbitrary path under the base URL (e.g. `/v2/chainlist`). */
export interface RawGet {
  <T = unknown>(path: string): Promise<EtherscanResponse<T>>;
}

export interface RequestConfig {
  baseUrl: string;
  timeout: number;
}

/** Merge endpoint params with the universal defaults and form-encode them. */
function serialize(params: QueryParams, defaults: Record<string, string | number>): string {
  const merged: Record<string, string> = {};
  for (const [key, value] of Object.entries({ ...params, ...defaults })) {
    merged[key] = String(value);
  }
  return new URLSearchParams(merged).toString();
}

/** Normalise an Etherscan response into a resolved body or a thrown error. */
function normalize(data: EtherscanResponse): EtherscanResponse {
  // Standard REST endpoints report failure with status "0".
  // (JSON-RPC proxy endpoints have no `status` field — skip them here.)
  if (data.status !== undefined && String(data.status) !== '1') {
    // A legitimately empty result also comes back as status "0", e.g.
    // `{ status: "0", message: "No transactions found", result: [] }`.
    // Treat that as success (resolve the empty list) rather than an error.
    const isEmptyResult =
      Array.isArray(data.result) ||
      (typeof data.message === 'string' && /\bno\b.*\bfound\b/i.test(data.message));

    if (!isEmptyResult) {
      let message = 'NOTOK';
      if (typeof data.result === 'string' && data.result) {
        message = data.result;
      } else if (typeof data.message === 'string' && data.message) {
        message = data.message;
      }
      throw new EtherscanError(message, { result: data.result, status: data.status });
    }
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
}

/**
 * Builds the shared GET request function. Every namespace passes a plain params
 * object; this injects the universal `apikey` and `chainid`, serialises the
 * query, performs the GET via the supplied transport, and normalises the result.
 */
export function createGetRequest(
  request: Transport,
  defaults: Record<string, string | number>,
  config: RequestConfig,
): GetRequest {
  return function getRequest<T = unknown>(params: QueryParams): Promise<EtherscanResponse<T>> {
    const url = config.baseUrl + '/v2/api?' + serialize(params, defaults);
    return Promise.resolve(request(url, { timeout: config.timeout })).then(normalize) as Promise<
      EtherscanResponse<T>
    >;
  };
}

/**
 * Builds a POST request function. Params (plus `apikey`/`chainid`) are sent as a
 * form-encoded body — required by the contract-verification endpoints.
 */
export function createPostRequest(
  request: Transport,
  defaults: Record<string, string | number>,
  config: RequestConfig,
): PostRequest {
  return function postRequest<T = unknown>(params: QueryParams): Promise<EtherscanResponse<T>> {
    const url = config.baseUrl + '/v2/api';
    const body = serialize(params, defaults);
    return Promise.resolve(
      request(url, { timeout: config.timeout, method: 'POST', body }),
    ).then(normalize) as Promise<EtherscanResponse<T>>;
  };
}

/**
 * Builds a raw GET function for endpoints that live outside `/v2/api` and take
 * no apikey/chainid — currently just `/v2/chainlist`.
 */
export function createRawGet(request: Transport, config: RequestConfig): RawGet {
  return function rawGet<T = unknown>(path: string): Promise<EtherscanResponse<T>> {
    return Promise.resolve(request(config.baseUrl + path, { timeout: config.timeout })).then(
      normalize,
    ) as Promise<EtherscanResponse<T>>;
  };
}
