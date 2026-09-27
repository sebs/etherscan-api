import { asList, normalize } from './response.js';
import type { LooseParams } from './params.js';
import type { EtherscanResponse, Transport, TransportOptions } from './types.js';

/** A GET or POST of params to `/v2/api`, with `apikey` and `chainid` added. */
export interface ApiRequest {
  <T = unknown>(params: LooseParams): Promise<EtherscanResponse<T>>;
}

/** A GET against an arbitrary path under the base URL (e.g. `/v2/chainlist`). */
export interface RawGet {
  <R = EtherscanResponse>(path: string): Promise<R>;
}

/** A request bound to one Etherscan module: callers name only the action and its params. */
export type ModuleCall = <T = unknown>(action: string, params?: LooseParams) => Promise<EtherscanResponse<T>>;

/** The requests a namespace makes against its Etherscan module. */
export interface ModuleRequests {
  /** GET an action. */
  call: ModuleCall;
  /** GET an action whose result is a list: an empty result resolves as `[]`. */
  list: ModuleCall;
  /** POST an action (the contract-verification endpoints). */
  post: ModuleCall;
}

/**
 * Everything a namespace needs to talk to Etherscan, handed to each namespace
 * as one object so they all share the same constructor signature.
 */
export interface RequestContext {
  /** GET `/v2/api` with `apikey` and `chainid` added. */
  get: ApiRequest;
  /** POST `/v2/api` with the params (plus `apikey`/`chainid`) as a form body. */
  post: ApiRequest;
  /** GET an arbitrary path under the base URL, without `apikey`/`chainid`. */
  raw: RawGet;
  /** The requests for one Etherscan module, e.g. `ctx.module('account')`. */
  module(name: string): ModuleRequests;
}

export interface RequestConfig {
  baseUrl: string;
  timeout: number;
  /** Passed to the transport when set. */
  maxResponseBytes?: number;
  /** Passed to the transport when set. */
  allowInsecure?: boolean;
}

/**
 * Keys that must never be forwarded from params. Defense-in-depth against
 * prototype pollution: verification params are caller-supplied objects, and
 * one parsed from JSON can carry an own `__proto__` key.
 */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Merge endpoint params with the universal defaults and form-encode them.
 * `undefined`/`null` values are dropped: from plain JS a missing argument would
 * otherwise be sent as the literal string "undefined" or "null".
 */
function serialize(params: LooseParams, defaults: Record<string, string | number>): string {
  const merged: Record<string, string> = {};
  for (const [key, value] of Object.entries({ ...params, ...defaults })) {
    if (UNSAFE_KEYS.has(key)) continue;
    if (value === undefined || value === null) continue;
    merged[key] = String(value);
  }
  return new URLSearchParams(merged).toString();
}

/**
 * Call the transport and normalise its answer. The call runs inside the promise
 * executor so a transport that throws synchronously still yields a rejection,
 * rather than an exception escaping from the API method.
 */
function send<R>(request: Transport, url: string, options: TransportOptions): Promise<R> {
  return new Promise<EtherscanResponse>((resolve) => resolve(request(url, options))).then(normalize) as Promise<R>;
}

/**
 * Build the request context: `get` and `post` inject the universal `apikey`
 * and `chainid` and serialise the params; `raw` hits paths outside `/v2/api`
 * (currently just `/v2/chainlist`). All of them normalise the response.
 */
export function createRequestContext(
  request: Transport,
  defaults: Record<string, string | number>,
  config: RequestConfig,
): RequestContext {
  const apiUrl = config.baseUrl + '/v2/api';
  // The transport options every request carries; the limits only when set.
  const base: TransportOptions = { timeout: config.timeout };
  if (config.maxResponseBytes !== undefined) base.maxResponseBytes = config.maxResponseBytes;
  if (config.allowInsecure !== undefined) base.allowInsecure = config.allowInsecure;

  const get: ApiRequest = <T = unknown>(params: LooseParams) =>
    send<EtherscanResponse<T>>(request, apiUrl + '?' + serialize(params, defaults), base);
  const post: ApiRequest = <T = unknown>(params: LooseParams) =>
    send<EtherscanResponse<T>>(request, apiUrl, { ...base, method: 'POST', body: serialize(params, defaults) });
  const raw: RawGet = <R = EtherscanResponse>(path: string) => send<R>(request, config.baseUrl + path, base);

  function module(name: string): ModuleRequests {
    // `module` and `action` are set after the params, so a stray key in
    // caller-supplied params cannot redirect the call to another endpoint.
    const bind =
      (to: ApiRequest): ModuleCall =>
      <T = unknown>(action: string, params: LooseParams = {}) =>
        to<T>({ ...params, module: name, action });
    const call = bind(get);
    const list: ModuleCall = <T = unknown>(action: string, params?: LooseParams) =>
      call<T>(action, params).then(asList);
    return { call, list, post: bind(post) };
  }

  return { get, post, raw, module };
}
