import { EtherscanError } from './errors.js';
/**
 * Keys that must never be copied from caller-supplied params. Defense-in-depth
 * against prototype pollution when forwarding arbitrary passthrough keys (e.g.
 * the `[key: string]` index on verification params).
 */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
/** True for keys that could pollute a prototype if copied via bracket assignment. */
export function isUnsafeKey(key) {
    return UNSAFE_KEYS.has(key);
}
/** Merge endpoint params with the universal defaults and form-encode them. */
function serialize(params, defaults) {
    const merged = {};
    for (const [key, value] of Object.entries({ ...params, ...defaults })) {
        if (isUnsafeKey(key))
            continue;
        merged[key] = String(value);
    }
    return new URLSearchParams(merged).toString();
}
/** Normalise an Etherscan response into a resolved body or a thrown error. */
function normalize(data) {
    // Standard REST endpoints report failure with status "0".
    // (JSON-RPC proxy endpoints have no `status` field — skip them here.)
    if (data.status !== undefined && String(data.status) !== '1') {
        // A legitimately empty result also comes back as status "0", e.g.
        // `{ status: "0", message: "No transactions found", result: [] }`.
        // Treat that as success (resolve the empty list) rather than an error.
        const isEmptyResult = Array.isArray(data.result) ||
            (typeof data.message === 'string' && /\bno\b.*\bfound\b/i.test(data.message));
        if (!isEmptyResult) {
            let message = 'NOTOK';
            if (typeof data.result === 'string' && data.result) {
                message = data.result;
            }
            else if (typeof data.message === 'string' && data.message) {
                message = data.message;
            }
            throw new EtherscanError(message, { result: data.result, status: data.status });
        }
    }
    // JSON-RPC proxy endpoints report failure with an `error` object/string.
    if (data.error) {
        let message = typeof data.error === 'string' ? data.error : 'Error';
        if (typeof data.error === 'object' && data.error !== null && 'message' in data.error) {
            message = String(data.error.message);
        }
        throw new EtherscanError(message, { result: data.error });
    }
    return data;
}
/**
 * Builds the shared GET request function. Every namespace passes a plain params
 * object; this injects the universal `apikey` and `chainid`, serialises the
 * query, performs the GET via the supplied transport, and normalises the result.
 */
export function createGetRequest(request, defaults, config) {
    return function getRequest(params) {
        const url = config.baseUrl + '/v2/api?' + serialize(params, defaults);
        return Promise.resolve(request(url, { timeout: config.timeout })).then(normalize);
    };
}
/**
 * Builds a POST request function. Params (plus `apikey`/`chainid`) are sent as a
 * form-encoded body — required by the contract-verification endpoints.
 */
export function createPostRequest(request, defaults, config) {
    return function postRequest(params) {
        const url = config.baseUrl + '/v2/api';
        const body = serialize(params, defaults);
        return Promise.resolve(request(url, { timeout: config.timeout, method: 'POST', body })).then(normalize);
    };
}
/**
 * Builds a raw GET function for endpoints that live outside `/v2/api` and take
 * no apikey/chainid — currently just `/v2/chainlist`.
 */
export function createRawGet(request, config) {
    return function rawGet(path) {
        return Promise.resolve(request(config.baseUrl + path, { timeout: config.timeout })).then(normalize);
    };
}
