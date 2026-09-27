import { EtherscanError } from './errors.js';
import type { EtherscanResponse } from './types.js';

/**
 * Etherscan's own text in a response body: the `result` string when it is one
 * (it usually carries the specific error, e.g. "Invalid address format"), else
 * the `message` string, else `''`. Shared by {@link normalize} and the default
 * transport's non-2xx errors, so both read Etherscan's body the same way.
 */
export function etherscanMessage(body: unknown): string {
  if (body === null || typeof body !== 'object') return '';
  const { result, message } = body as { result?: unknown; message?: unknown };
  return (typeof result === 'string' && result) || (typeof message === 'string' && message) || '';
}

/**
 * Whether a status-"0" response is Etherscan's "nothing found" rather than a
 * failure, e.g. `{ status: "0", message: "No transactions found", result: [] }`.
 *
 * Both halves are required. The message alone is not enough: a real failure
 * can carry a matching message ("No records found" alongside `result:
 * "Error! Invalid address format"`). Nor is an array alone: `{ message:
 * "NOTOK", result: [] }` is a failure. So the message must *start* with
 * "No … found" and `result` must be empty. {@link asList} turns the same empty
 * `result` into `[]` for list endpoints.
 */
function isEmptyResult(data: EtherscanResponse): boolean {
  const empty =
    data.result === undefined ||
    data.result === null ||
    data.result === '' ||
    (Array.isArray(data.result) && data.result.length === 0);
  return empty && typeof data.message === 'string' && /^no\b.*\bfound\b/i.test(data.message);
}

/** Normalise an Etherscan response into a resolved body or a thrown error. */
export function normalize(data: EtherscanResponse): EtherscanResponse {
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

  // Standard REST endpoints report failure with status "0", except for an
  // empty result. (JSON-RPC proxy endpoints have no `status` field.)
  if (data.status !== undefined && String(data.status) !== '1' && !isEmptyResult(data)) {
    throw new EtherscanError(etherscanMessage(data) || 'NOTOK', {
      result: data.result,
      status: data.status,
      responseMessage: data.message,
    });
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
 * "nothing found" with a `result` of `[]`, `''` or `null`; the last two become
 * `[]`, so callers can iterate a list result without a guard.
 */
export function asList<T>(res: EtherscanResponse<T>): EtherscanResponse<T> {
  const result: unknown = res.result;
  return result === '' || result === null || result === undefined ? { ...res, result: [] as T } : res;
}
