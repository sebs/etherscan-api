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
}

/**
 * HTTP transport contract. Receives a fully-qualified URL and resolves with the
 * parsed JSON body. The default implementation uses Node's built-in `https`;
 * callers can supply their own as the 4th argument to {@link init}.
 */
export type Transport = (url: string, options?: TransportOptions) => Promise<EtherscanResponse>;
