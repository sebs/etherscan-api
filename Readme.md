# Etherscan API

[![npm](https://img.shields.io/npm/dt/etherscan-api.svg)](https://www.npmjs.com/package/etherscan-api)
[![license](https://img.shields.io/github/license/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api/blob/master/LICENSE.md)
[![GitHub tag](https://img.shields.io/github/tag/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api)
[![GitHub issues](https://img.shields.io/github/issues/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api/issues)

A way to access the [etherscan.io api](https://etherscan.io/apis) using promises. Fetch a diverse set of information about the blockchain.

Mainnet


```javascript
var api = require('etherscan-api').init('YourApiKey');
var balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
balance.then(function(balanceData){
  console.log(balanceData);
});
```

## Example in the wild

* [Polymer3 based example](https://github.com/hiherto-elements/test-app)


## Zero dependencies / custom HTTP transport

This library has **no runtime dependencies** — requests use Node's built-in
`https` module. If you need custom networking (a proxy, retries, a different
agent), pass your own transport as the 4th argument to `init`. It receives the
fully-qualified URL and must resolve with the parsed JSON body:

```js
const { init } = require('etherscan-api');

// (url, { timeout }) => Promise<object>
async function request(url, { timeout }) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeout) });
  return res.json();
}

var api = init('apikey', null, 10000, request);
```

## Selecting a chain (Etherscan V2 / multichain)

Etherscan deprecated the V1 API on 2025-08-15. This library now talks to a
single base URL — `https://api.etherscan.io/v2/api` — and selects the network
with a `chainid` query parameter. **One API key works across all chains.**

Pass a chain name (or a numeric chainid) as the second argument to `init`:

```javascript
// apikey, chain, timeout
var api = require('etherscan-api').init('YourApiKey', 'sepolia', 3000);
```

Supported chain names:

| Name                                | chainid    |
| ----------------------------------- | ---------- |
| `mainnet` / `homestead` / `ethereum`| 1          |
| `sepolia`                           | 11155111   |
| `holesky`                           | 17000      |
| `arbitrum`                          | 42161      |
| `optimism`                          | 10         |
| `base`                              | 8453       |
| `polygon`                           | 137        |
| `bsc`                               | 56         |
| `avalanche`                         | 43114      |

Any other chain is reachable by passing its numeric chainid directly, e.g.
`init('YourApiKey', 59144)` for Linea.

Retired testnets (`ropsten`, `rinkeby`, `kovan`, `goerli`, `morden`,
`arbitrum_rinkeby`, `avalanche_fuji`) have been removed and now **throw** an
error with a helpful message — use `sepolia` or `holesky` instead.

## Install

 ```bash
 npm install etherscan-api --save
 ```


## API Documentation

[Full Api Docs](https://sebs.github.io/etherscan-api/)


## Development workflow

* npm test  - runs the (fully mocked) test suite, no API key required
  * npm run posttest - starts the linter
* npm run test:live - runs the tests against the real Etherscan API
* npm run lint - preconfigured linter
* npm run docs - generates the apidocs
* npm run preversion - Steps before we create a new Tag
  * lint
  * changelog
* npm run pages - pushes generated apidocs to the server
* postversion - after generating a new version, push the tag to the server
* npm run changelog - generates a changelog and pushes it
