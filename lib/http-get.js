import https from 'node:https';
import http from 'node:http';
/**
 * Default HTTP transport: performs a GET and resolves the parsed JSON body.
 * Uses only Node built-ins (no third-party HTTP client). Callers can supply
 * their own transport with the same signature as the 4th argument to {@link init}.
 */
const httpGet = function httpGet(url, options) {
    const timeout = (options && options.timeout) || 10000;
    return new Promise((resolve, reject) => {
        const transport = url.indexOf('http://') === 0 ? http : https;
        const req = transport.get(url, (res) => {
            const status = res.statusCode || 0;
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                if (status < 200 || status >= 300) {
                    reject(new Error('Request failed with status code ' + status));
                    return;
                }
                try {
                    resolve(JSON.parse(body));
                }
                catch (err) {
                    reject(new Error('Failed to parse response body: ' + err.message));
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(timeout, () => {
            req.destroy(new Error('Request timed out after ' + timeout + 'ms'));
        });
    });
};
export default httpGet;
