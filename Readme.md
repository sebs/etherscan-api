# Etherscan API

[![npm](https://img.shields.io/npm/dt/etherscan-api.svg)](https://www.npmjs.com/package/etherscan-api)
[![license](https://img.shields.io/github/license/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api/blob/master/LICENSE.md)
[![GitHub tag](https://img.shields.io/github/tag/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api)
[![GitHub issues](https://img.shields.io/github/issues/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api/issues)

A way to access the [etherscan.io api](https://etherscan.io/apis) using promises. Fetch a diverse set of information about the blockchain.

Written in TypeScript, shipped as an **ES module** with bundled type declarations. Requires Node.js >= 22.

Mainnet


```javascript
import { init } from 'etherscan-api';

const api = init('YourApiKey');
const balance = await api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
console.log(balance);
```

## Zero dependencies / custom HTTP transport

This library has **no runtime dependencies** — requests use Node's built-in
`https` module. If you need custom networking (a proxy, retries, a different
agent), pass your own transport as the 4th argument to `init`. It receives the
fully-qualified URL and must resolve with the parsed JSON body:

```js
import { init } from 'etherscan-api';

// (url, { timeout, method, body }) => Promise<object>
// `method`/`body` are only set for the POST contract-verification endpoints;
// for read-only use you can ignore them.
async function request(url, { timeout, method = 'GET', body }) {
  const res = await fetch(url, {
    method,
    body,
    headers: body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : undefined,
    signal: AbortSignal.timeout(timeout),
  });
  // fetch resolves on any HTTP status; surface non-2xx as an error.
  if (!res.ok) throw new Error(`Request failed with status code ${res.status}`);
  return res.json();
}

const api = init('apikey', null, 10000, request);
```

## Security notes

* **The API key travels in the request URL on GET requests.** Etherscan requires
  `apikey` as a query parameter, so it is part of every GET request URL. Treat
  full request URLs as secrets: **do not log them**, and be careful with
  proxies, APM tools, and access logs that capture URLs. A custom transport
  receives the URL containing the key — never write it to logs verbatim. (The
  library itself never puts the URL or key into thrown errors.)
  The POST contract-verification endpoints are the exception: there the key is
  sent in the form body and the URL is a bare `/v2/api`.
* **The default transport refuses cleartext `http://`.** Requests go to
  `https://api.etherscan.io` over TLS with certificate validation on. If a
  request somehow targets an `http://` URL, the default transport rejects rather
  than sending the key unencrypted; pass `{ allowInsecure: true }` in the
  transport options only if you deliberately need cleartext (e.g. a local test
  server).
* **The default transport caps the response body at 50 MB** to guard against a
  memory-exhaustion response. Override with `maxResponseBytes` in the transport
  options if you expect larger payloads.

### Overriding the transport options

`init` also takes an options object, where `maxResponseBytes` and
`allowInsecure` are plain fields. Both are passed to the transport on every
request (a custom transport receives them too):

```js
import { init } from 'etherscan-api';

const api = init({
  apiKey: 'apikey',
  chain: 'mainnet',
  timeout: 10000,
  maxResponseBytes: 200 * 1024 * 1024,
});
```

## Selecting a chain (Etherscan V2 / multichain)

Etherscan deprecated the V1 API on 2025-08-15. This library now talks to a
single base URL — `https://api.etherscan.io/v2/api` — and selects the network
with a `chainid` query parameter. **One API key works across all chains.**

Pass a chain name (or a numeric chainid) as the second argument to `init`:

```javascript
import { init } from 'etherscan-api';

// apikey, chain, timeout
const api = init('YourApiKey', 'sepolia', 3000);
```

Supported chain names, and whether a free API key can use them:

| Name                                | chainid    | Free key |
| ----------------------------------- | ---------- | -------- |
| `mainnet` / `homestead` / `ethereum`| 1          | yes      |
| `sepolia`                           | 11155111   | yes      |
| `hoodi`                             | 560048     | yes      |
| `arbitrum`                          | 42161      | yes      |
| `optimism`                          | 10         | **no**   |
| `base`                              | 8453       | **no**   |
| `polygon`                           | 137        | yes      |
| `bsc`                               | 56         | **no**   |
| `avalanche`                         | 43114      | **no**   |
| `avalanche_fuji`                    | 43113      | yes      |

On a chain marked **no**, every call with a free key fails with *"Free API
access is not supported for this chain"*. Etherscan sets this per chain and can
change it; the table reflects November 2026. For the current list, call
`api.usage.chainlist()` (no paid plan needed): each entry's `comment` says
`Free-tier available` or `Paid Plan required`.

Any other chain is reachable by passing its numeric chainid directly, e.g.
`init('YourApiKey', 59144)` for Linea.

Retired testnets (`ropsten`, `rinkeby`, `kovan`, `goerli`, `holesky`, `morden`,
`arbitrum_rinkeby`) have been removed and now **throw** an
error with a helpful message — use `sepolia` or `hoodi` instead.

## Errors

Every error a call raises is an `EtherscanError`: a failure Etherscan reports,
an HTTP or network failure (`EtherscanHttpError`, with `statusCode` and
`headers`), or an argument rejected before any request
(`EtherscanArgumentError`, with `argument`). Etherscan's own text becomes the
message, e.g. `Contract source code not verified`.

Etherscan reports an exceeded rate limit as an ordinary failure (an HTTP 200
with status `"0"`). `rateLimited` tells it apart, so you can back off and retry:

```js
import { EtherscanError } from 'etherscan-api';

try {
  await api.account.balance(address);
} catch (err) {
  if (err instanceof EtherscanError && err.rateLimited) {
    // e.g. "Max calls per sec rate limit reached (3/sec)": wait, then retry
  }
}
```

## Paging

The list endpoints differ in what they return when you pass no `page` or
`offset`:

| Without paging options | Endpoints |
| ---------------------- | --------- |
| **First 100 records** (`page: 1, offset: 100` is sent) | `account.txlist`, `tokentx`, `tokennfttx`, `token1155tx`, `txsBeaconWithdrawal`, `getdeposittxs`, `getwithdrawaltxs`, `txnbridge` |
| **Etherscan's unpaged result**, up to its own cap | `account.txlistinternal`, `getminedblocks`, `log.getLogs` (capped at 1 000 records) |

So `api.account.txlist(address)` returns at most 100 transactions, even for an
address with thousands. Pass `page` and `offset` to get more, and page through
larger results. Giving only one of them fills in the other (`page` 1, `offset`
100), because Etherscan ignores either one on its own.

`page × offset` may not exceed 10 000, Etherscan's result window, so the
library rejects such a call before sending it. Past that, narrow the block
range (`startblock` / `endblock`) instead:

```js
const page = await api.account.txlist(address, { page: 2, offset: 1000, sort: 'desc' });
```

## Install

 ```bash
 npm install etherscan-api --save
 ```


## API Documentation

[Full Api Docs](https://sebs.github.io/etherscan-api/), including a short
[tutorial](docs/tutorial.md) (also covering use from CommonJS) and
[examples](examples.md).


## Development workflow

Source lives in `./src` (TypeScript) and compiles to `./lib` (ES modules + `.d.ts`).

* `npm run build` - compiles `src` → `lib` with `tsc`
* `npm run typecheck` - type-checks without emitting (replaces the old linter)
* `npm test` - builds, then runs the fully mocked test suite (no API key required)
* `npm run docs` - generates the API docs with TypeDoc
* `npm run preversion` - runs the full test suite (build + type-check + tests) before `npm version` tags a release

Release notes are generated when a `v*` tag is pushed: the release workflow
lists the commits since the previous tag as the body of the GitHub release.

## Sponsors

This library is maintained in my spare time. If your company relies on it,
consider sponsoring — it directly funds maintenance and new features.
Sponsors at $50/month or more get their logo placed here.

<!-- sponsors -->
_No sponsors yet — [be the first](https://github.com/sponsors/sebs)_
<!-- /sponsors -->