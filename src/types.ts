/**
 * A raw Etherscan API response body, generic over the shape of `result`.
 * REST endpoints return `{ status, message, result }`; JSON-RPC proxy endpoints
 * return `{ jsonrpc, id, result }` or `{ ..., error }`. `result` is `T | undefined`
 * because it is absent on some error responses.
 *
 * @typeParam T - The shape of the `result` field for a given endpoint (default `unknown`).
 */
export interface EtherscanResponse<T = unknown> {
  status?: string;
  message?: string;
  result?: T;
  error?: unknown;
  jsonrpc?: string;
  id?: number;
  [key: string]: unknown;
}

export interface TransportOptions {
  /** Request timeout in milliseconds. */
  timeout?: number;
  /** HTTP method (default `'GET'`). `'POST'` is used by the verification endpoints. */
  method?: 'GET' | 'POST';
  /** Form-encoded request body, set for `POST` requests. */
  body?: string;
  /**
   * Maximum response body size in bytes. The default transport aborts and
   * rejects once the accumulated body exceeds this, guarding against
   * memory-exhaustion from an oversized response. Defaults to 50 MB.
   */
  maxResponseBytes?: number;
  /**
   * Permit cleartext `http://` URLs. The default transport refuses non-HTTPS
   * URLs unless this is set, so a misconfigured base URL cannot silently send
   * the API key over the wire unencrypted. Defaults to `false`.
   */
  allowInsecure?: boolean;
}

/**
 * HTTP transport contract. Receives a fully-qualified URL plus options and
 * resolves with the parsed JSON body. The default implementation uses Node's
 * built-in `https`/`http`; callers can supply their own as the 4th argument to
 * {@link init}. A custom transport only needs to honour `options.method` and
 * `options.body` if it will be used for the contract-verification endpoints.
 */
export type Transport = (url: string, options?: TransportOptions) => Promise<EtherscanResponse>;
