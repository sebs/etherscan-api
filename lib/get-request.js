import { EtherscanError } from './errors.js';
/**
 * Builds the shared request function. Every namespace passes a plain params
 * object; this injects the universal `apikey` and `chainid`, serialises the
 * query, performs the GET via the supplied transport, and normalises the result.
 */
export function createGetRequest(request, defaults, config) {
    return function getRequest(params) {
        const merged = {};
        for (const [key, value] of Object.entries({ ...params, ...defaults })) {
            merged[key] = String(value);
        }
        const query = new URLSearchParams(merged).toString();
        const url = config.baseUrl + '/v2/api?' + query;
        return Promise.resolve(request(url, { timeout: config.timeout })).then((data) => {
            // Standard REST endpoints report failure with status "0".
            // (JSON-RPC proxy endpoints have no `status` field — skip them here.)
            if (data.status !== undefined && String(data.status) !== '1') {
                let message = 'NOTOK';
                if (typeof data.result === 'string' && data.result) {
                    message = data.result;
                }
                else if (typeof data.message === 'string' && data.message) {
                    message = data.message;
                }
                throw new EtherscanError(message, { result: data.result, status: data.status });
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
        });
    };
}
