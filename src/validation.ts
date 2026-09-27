import { EtherscanArgumentError } from './errors.js';
import type { Transport } from './types.js';

/**
 * Render a rejected value for an error message. Numbers go through String():
 * JSON.stringify turns NaN and Infinity into "null". JSON.stringify also throws
 * (BigInt, circular objects) or returns undefined (symbols, functions), so
 * those fall back to String() rather than masking the real error.
 */
export function describeValue(value: unknown): string {
  if (typeof value === 'number') return String(value);
  if (typeof value === 'bigint') return value + 'n';
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();
  try {
    const json = JSON.stringify(value);
    if (json !== undefined) return json;
  } catch {
    // fall through
  }
  return String(value);
}

/**
 * The error for an argument that failed validation, in the one message format
 * used across the library: `Invalid <argument> <value>: expected <expected>`.
 */
export function invalid(argument: string, value: unknown, expected: string): EtherscanArgumentError {
  return new EtherscanArgumentError(`Invalid ${argument} ${describeValue(value)}: expected ${expected}`, argument, value);
}

/**
 * Validate an API key and return it trimmed (a key read from a file keeps its
 * trailing newline). The value is never echoed into the message: it may be the
 * key itself.
 * @throws {EtherscanArgumentError} If the key is not a string, or empty.
 */
export function checkApiKey(apiKey: unknown): string {
  if (apiKey !== undefined && apiKey !== null && typeof apiKey !== 'string') {
    throw new EtherscanArgumentError(`Invalid API key: expected a string, got ${typeof apiKey}`, 'apiKey');
  }
  const key = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (key === '') {
    throw new EtherscanArgumentError(
      'An Etherscan API key is required: init(apiKey, chain?, timeout?, request?)',
      'apiKey',
    );
  }
  return key;
}

/**
 * Validate a custom transport. Only its type is reported; the value may be a
 * large object.
 * @throws {EtherscanArgumentError} If it is given but not a function.
 */
export function checkTransport(request: unknown): Transport | undefined {
  if (request === undefined || request === null) return undefined;
  if (typeof request !== 'function') {
    throw new EtherscanArgumentError(
      `Invalid request transport: expected a function, got ${typeof request}`,
      'request',
    );
  }
  return request as Transport;
}

/** Default request timeout in milliseconds. */
const DEFAULT_TIMEOUT = 10000;

/** Node's timers cap at 2^31-1 ms; anything larger fires after 1 ms instead. */
const MAX_TIMEOUT = 2 ** 31 - 1;

/**
 * Resolve a caller-supplied timeout: `undefined`/`null` mean the 10 s default,
 * anything else must be a positive, finite number of milliseconds within Node's
 * timer range. A numeric string (e.g. straight from `process.env`) is accepted.
 * @throws {EtherscanArgumentError} If the timeout is invalid.
 */
export function resolveTimeout(timeout: unknown): number {
  if (timeout === undefined || timeout === null) return DEFAULT_TIMEOUT;
  const ms = typeof timeout === 'string' && /^\s*\d+(\.\d+)?\s*$/.test(timeout) ? Number(timeout) : timeout;
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0 || ms > MAX_TIMEOUT) {
    throw invalid('timeout', timeout, `a positive number of milliseconds up to ${MAX_TIMEOUT}`);
  }
  return ms;
}

/** Default cap on the response body size (50 MB). See `maxResponseBytes`. */
const DEFAULT_MAX_RESPONSE_BYTES = 50 * 1024 * 1024;

/**
 * Resolve the response-size cap: `undefined`/`null` mean 50 MB. `??`, not
 * `||`: an explicit 0 ("reject any body") must not become 50 MB.
 * @throws {EtherscanArgumentError} For a negative or non-numeric value.
 */
export function resolveMaxResponseBytes(maxResponseBytes: unknown): number {
  const bytes = maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
  if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes < 0) {
    throw invalid('maxResponseBytes', maxResponseBytes, 'a non-negative number of bytes');
  }
  return bytes;
}

/** Sort order accepted by the list endpoints. */
export type SortOrder = 'asc' | 'desc';

/**
 * Validate a sort order. An empty/omitted sort means `'asc'` (`||` rather than
 * `??`, so `''` is not sent as a bare `sort=`).
 * @throws {EtherscanArgumentError} For anything other than `'asc'` or `'desc'`.
 */
export function checkSort(sort?: string): SortOrder {
  const order = sort || 'asc';
  if (order !== 'asc' && order !== 'desc') {
    throw invalid('sort', sort, "'asc' or 'desc'");
  }
  return order;
}

/** Etherscan serves at most this many records per query: `page × offset` must not exceed it. */
const MAX_RESULT_WINDOW = 10000;

/**
 * Validate paging against Etherscan's rules: `page` and `offset` are positive
 * integers and `page × offset` stays within the 10 000-record result window.
 * @throws {EtherscanArgumentError} If the combination would be rejected by Etherscan.
 */
export function checkPaging(page: number, offset: number): void {
  for (const [name, value] of [['page', page], ['offset', offset]] as const) {
    if (!Number.isSafeInteger(value) || value < 1) {
      throw invalid(name, value, 'a positive integer');
    }
  }
  if (page * offset > MAX_RESULT_WINDOW) {
    throw new EtherscanArgumentError(
      `page × offset (${page} × ${offset}) exceeds Etherscan's ${MAX_RESULT_WINDOW}-record result window`,
      'offset',
      offset,
    );
  }
}

/**
 * Validate the number of addresses sent to a multi-address endpoint.
 * @param method - The API method, for the message (e.g. `'balance'`)
 * @throws {EtherscanArgumentError} For an empty list or more than `max` entries.
 */
export function checkAddressCount(method: string, addresses: readonly string[], max: number): void {
  if (addresses.length === 0 || addresses.length > max) {
    throw new EtherscanArgumentError(
      `${method}() takes 1 to ${max} addresses, got ${addresses.length}`,
      'address',
      addresses,
    );
  }
}

/**
 * Largest timestamp accepted as Unix *seconds* (year ~5138). Anything above is
 * almost certainly milliseconds — `Date.now()` — which is off by 1000×.
 */
const MAX_UNIX_SECONDS = 1e11;

/**
 * Convert a timestamp (Unix seconds, a numeric string, or a `Date`) to Unix
 * seconds.
 * @throws {EtherscanArgumentError} For a non-integer, negative or millisecond value.
 */
export function unixSeconds(timestamp: string | number | Date): number {
  const seconds = timestamp instanceof Date ? Math.floor(timestamp.getTime() / 1000) : Number(timestamp);
  if (!Number.isSafeInteger(seconds) || seconds < 0) {
    throw invalid('timestamp', timestamp, 'Unix seconds or a Date');
  }
  if (seconds > MAX_UNIX_SECONDS) {
    throw new EtherscanArgumentError(
      `Timestamp ${seconds} looks like milliseconds; pass Unix seconds (Math.floor(ms / 1000)) or a Date`,
      'timestamp',
      timestamp,
    );
  }
  return seconds;
}
