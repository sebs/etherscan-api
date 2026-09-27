export interface EtherscanErrorDetails {
  result?: unknown;
  status?: unknown;
}

/**
 * Error thrown when the Etherscan API returns a logical failure: a `status` of
 * "0", a NOTOK message, or a JSON-RPC error object.
 */
export class EtherscanError extends Error {
  /** The raw `result` (or `error`) field from the response, if any. */
  readonly result?: unknown;
  /** The raw `status` field from the response, if any. */
  readonly status?: unknown;

  constructor(message: string, details: EtherscanErrorDetails = {}) {
    super(message);
    this.name = 'EtherscanError';
    this.result = details.result;
    this.status = details.status;
  }
}

/**
 * Error thrown by the default transport when Etherscan answers with a non-2xx
 * HTTP status. Carries the status code and response headers so callers can
 * tell a 429 from a 5xx and honour `Retry-After`.
 */
export class EtherscanHttpError extends Error {
  /** The HTTP status code, e.g. `429`. */
  readonly statusCode: number;
  /**
   * The response headers (lower-cased names), e.g. `headers['retry-after']`.
   * Typed structurally rather than as node:http's IncomingHttpHeaders so the
   * declarations do not require consumers to install @types/node.
   */
  readonly headers: Record<string, string | string[] | undefined>;

  constructor(message: string, statusCode: number, headers: Record<string, string | string[] | undefined> = {}) {
    super(message);
    this.name = 'EtherscanHttpError';
    this.statusCode = statusCode;
    this.headers = headers;
  }
}
