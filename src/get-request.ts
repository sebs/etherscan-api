import { EtherscanError } from './errors.js';
import type { EtherscanResponse, Transport, TransportOptions } from './types.js';

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

/**
 * Keys that must never be copied from caller-supplied params. Defense-in-depth
 * against prototype pollution when forwarding arbitrary passthrough keys (e.g.
 * the `[key: string]` index on verification params).
 */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** True for keys that could pollute a prototype if copied via bracket assignment. */
export function isUnsafeKey(key: string): boolean {
  return UNSAFE_KEYS.has(key);
}

/**
 * Merge endpoint params with the universal defaults and form-encode them.
 * `undefined`/`null` values are dropped: from plain JS a missing argument would
 * otherwise be sent as the literal string "undefined" or "null".
 */
function serialize(params: QueryParams, defaults: Record<string, string | number>): string {
  const merged: Record<string, string> = {};
  for (const [key, value] of Object.entries({ ...params, ...defaults })) {
    if (isUnsafeKey(key)) continue;
    if (value === undefined || value === null) continue;
    merged[key] = String(value);
  }
  return new URLSearchParams(merged).toString();
}

/** Normalise an Etherscan response into a resolved body or a thrown error. */
function normalize(data: EtherscanResponse): EtherscanResponse {
  // A body that is not an object has no status/result/error to inspect. This
  // happens when something other than Etherscan answers (a proxy or WAF can
  // return a bare `null`, which is valid JSON) or when a custom transport
  // resolves with nothing. Reject with the library's own error type rather than
  // letting the property reads below throw an opaque TypeError.
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new EtherscanError('Unexpected response body from Etherscan (not a JSON object)', {
      result: data,
    });
  }

  // Standard REST endpoints report failure with status "0".
  // (JSON-RPC proxy endpoints have no `status` field — skip them here.)
  if (data.status !== undefined && String(data.status) !== '1') {
    // A legitimately empty result also comes back as status "0", e.g.
    // `{ status: "0", message: "No transactions found", result: [] }`.
    // Treat that as success (resolve the empty list) rather than an error.
    //
    // Both halves are required. The message alone is not enough: a real failure
    // can carry a matching message ("No records found" alongside `result:
    // "Error! Invalid address format"`). Nor is an array alone: `{ message:
    // "NOTOK", result: [] }` is a failure. So the message must *start* with
    // "No … found" and `result` must be empty.
    const isEmptyPayload =
      data.result === undefined ||
      data.result === null ||
      data.result === '' ||
      (Array.isArray(data.result) && data.result.length === 0);
    const isEmptyResult =
      isEmptyPayload && typeof data.message === 'string' && /^no\b.*\bfound\b/i.test(data.message);

    if (!isEmptyResult) {
      let message = 'NOTOK';
      if (typeof data.result === 'string' && data.result) {
        message = data.result;
      } else if (typeof data.message === 'string' && data.message) {
        message = data.message;
      }
      throw new EtherscanError(message, {
        result: data.result,
        status: data.status,
        responseMessage: data.message,
      });
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
 * Resolve an empty list the way the list endpoints are typed. Etherscan answers
 * "nothing found" with status "0" and a `result` of `[]`, `''` or `null`; the
 * last two become `[]`, so callers can iterate a list result without a guard.
 */
export function emptyAsList<T>(response: Promise<EtherscanResponse<T>>): Promise<EtherscanResponse<T>> {
  return response.then((res) => {
    const result: unknown = res.result;
    return result === '' || result === null || result === undefined ? { ...res, result: [] as T } : res;
  });
}

/**
 * Call the transport and normalise its answer. The call runs inside the promise
 * executor so a transport that throws synchronously still yields a rejection,
 * rather than an exception escaping from the API method.
 */
function send(request: Transport, url: string, options: TransportOptions): Promise<EtherscanResponse> {
  return new Promise<EtherscanResponse>((resolve) => resolve(request(url, options))).then(normalize);
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
    return send(request, url, { timeout: config.timeout }) as Promise<EtherscanResponse<T>>;
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
    return send(request, url, { timeout: config.timeout, method: 'POST', body }) as Promise<
      EtherscanResponse<T>
    >;
  };
}

/**
 * Builds a raw GET function for endpoints that live outside `/v2/api` and take
 * no apikey/chainid — currently just `/v2/chainlist`.
 */
export function createRawGet(request: Transport, config: RequestConfig): RawGet {
  return function rawGet<T = unknown>(path: string): Promise<EtherscanResponse<T>> {
    return send(request, config.baseUrl + path, { timeout: config.timeout }) as Promise<
      EtherscanResponse<T>
    >;
  };
}
