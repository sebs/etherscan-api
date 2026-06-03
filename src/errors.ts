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
