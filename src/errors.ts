export interface EtherscanErrorDetails {
  result?: unknown;
  status?: unknown;
  responseMessage?: unknown;
}

/**
 * Error thrown when the Etherscan API returns a failure: a `status` of "0", a
 * NOTOK message, or a JSON-RPC error object. An HTTP-level failure from the
 * default transport is the subclass {@link EtherscanHttpError}, so one
 * `instanceof EtherscanError` check covers both.
 */
export class EtherscanError extends Error {
  /** The raw `result` (or `error`) field from the response, if any. */
  readonly result?: unknown;
  /** The raw `status` field from the response, if any. */
  readonly status?: unknown;
  /**
   * The response's own `message` field (e.g. `"NOTOK"`), if any. Kept apart
   * from `message`, which usually carries the more specific `result` text.
   */
  readonly responseMessage?: unknown;

  constructor(message: string, details: EtherscanErrorDetails = {}) {
    super(message);
    this.name = 'EtherscanError';
    this.result = details.result;
    this.status = details.status;
    this.responseMessage = details.responseMessage;
  }
}

/**
 * Error thrown by the default transport when Etherscan answers with a non-2xx
 * HTTP status. Carries the status code and response headers so callers can
 * tell a 429 from a 5xx and honour `Retry-After`. It extends
 * {@link EtherscanError}: the same condition (a rate limit, say) can arrive as
 * a 200 with status "0" or as a 429, and one `instanceof` check catches both.
 */
export class EtherscanHttpError extends EtherscanError {
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
