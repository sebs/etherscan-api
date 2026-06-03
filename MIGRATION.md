# Migrating to v11 (Etherscan V2 API)

Etherscan **deprecated the V1 API on 2025-08-15**. Version 11 of `etherscan-api`
targets the unified **V2** endpoint: a single base URL with a `chainid`
parameter, and one API key that works across every supported chain.

The public method surface is unchanged — `api.<namespace>.<method>()` calls work
exactly as before. The breaking changes are in configuration, chain selection,
and error handling.

## Breaking changes

### 1. Endpoint & API key
The library now calls `https://api.etherscan.io/v2/api?chainid=…` instead of the
old per-chain hosts. A single Etherscan API key works across all chains — no
more per-explorer keys.

> If you pass your own axios client, set its `baseURL` to the host
> `https://api.etherscan.io` (the library appends `/v2/api`).

### 2. `chain` now means a chainid
`init(apiKey, chain)` still takes a second `chain` argument, but it now resolves
to a numeric `chainid`. Pass a supported **name** or a raw **numeric chainid**:

```js
init('KEY');             // Ethereum mainnet (chainid 1)
init('KEY', 'sepolia');  // 11155111
init('KEY', 'arbitrum'); // 42161
init('KEY', 8453);       // Base, by numeric chainid
```

Supported names: `mainnet`/`homestead`/`ethereum`, `sepolia`, `holesky`,
`arbitrum`, `optimism`, `base`, `polygon`, `bsc`, `avalanche`. Anything else is
reachable via a numeric chainid.

### 3. Retired testnets now throw
`ropsten`, `rinkeby`, `kovan`, `goerli`, `morden`, `arbitrum_rinkeby`, and
`avalanche_fuji` are gone. Passing them throws an error pointing you to a live
network. Previously these silently fell back to mainnet — a dangerous default
for a blockchain client. **Use `sepolia` or `holesky` instead.**

### 4. `pickChainUrl` was removed
It returned a per-chain host, a concept that no longer exists in V2. Calling it
now throws with a pointer to the replacement. Use the new `resolveChainId(chain)`
export if you need a chainid from a name:

```js
const { resolveChainId } = require('etherscan-api');
resolveChainId('sepolia'); // 11155111
```

### 5. Rejections are always `Error` objects
Failed requests now reject with an `EtherscanError` (a subclass of `Error`)
instead of, in some cases, a bare string. It carries `.message`, plus `.result`
and `.status` from the API response.

```js
api.account.balance('bad').catch(err => {
  err instanceof Error; // true
  err.message;          // e.g. "Invalid address format"
  err.status;           // raw API status, when present
});
```

If you previously did `.catch(msg => …)` expecting a string, switch to
`.catch(err => err.message)`.

## Non-breaking housekeeping in this release
- `axios` upgraded to a current, advisory-free release; **0 production
  vulnerabilities**.
- Removed the unused `querystring` dependency; `gh-pages` moved to
  `devDependencies`.
- Test suite is now fully mocked with `nock` — `npm test` needs no API key and
  never hits the network. An opt-in live smoke suite runs via
  `ETHERSCAN_LIVE=1 npm run test:live`.
- License metadata corrected to **MIT**.
