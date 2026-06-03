/**
 * A raw Etherscan API response body. REST endpoints return
 * `{ status, message, result }`; JSON-RPC proxy endpoints return
 * `{ jsonrpc, id, result }` or `{ ..., error }`.
 */
export interface EtherscanResponse {
  status?: string;
  message?: string;
  result?: unknown;
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
}

/**
 * HTTP transport contract. Receives a fully-qualified URL plus options and
 * resolves with the parsed JSON body. The default implementation uses Node's
 * built-in `https`/`http`; callers can supply their own as the 4th argument to
 * {@link init}. A custom transport only needs to honour `options.method` and
 * `options.body` if it will be used for the contract-verification endpoints.
 */
export type Transport = (url: string, options?: TransportOptions) => Promise<EtherscanResponse>;
