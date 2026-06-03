# Migration Plan: Etherscan API V1 → V2

**Date:** 2026-06-03
**Target:** `etherscan-api` next major (proposed **v11.0.0**)
**Companion doc:** see [review.md](review.md) for the full project review (this plan executes findings **C1, C2, C3, H1, H3**).

---

## 1. Why this is necessary

Etherscan **deprecated the V1 API on 15 August 2025**. Every request this library builds today targets the retired V1 shape (per-chain subdomain hosts), so the package is effectively non-functional against live Etherscan and must be migrated to V2.

### What changed in V2

| Aspect | V1 (current code) | V2 (target) |
|---|---|---|
| Base URL | `https://api.etherscan.io/api` (+ `api-ropsten.…`, `api.arbiscan.io`, `api.snowtrace.io`, …) | **One** base: `https://api.etherscan.io/v2/api` |
| Chain selection | Implicit — encoded in the **hostname** | Explicit **`chainid`** query parameter (required) |
| API key | Chain-specific key per explorer | **One universal key** across 60+ chains |
| API key param | code sends `apiKey` (see C3 — wrong) | must be lowercase **`apikey`** |

Example V2 request:
```
https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&tag=latest&apikey=YourApiKeyToken
```

### Two bugs this migration also fixes

- **C3 — wrong API-key param name.** All namespaces build `{ module, action, apiKey, … }`, which `URLSearchParams` serialises as `apiKey=…`. Etherscan expects `apikey=…`, so requests are currently sent **unauthenticated** (anonymous rate limit). The V2 rewrite touches every call site, so we fix this in the same pass.
- **C2 — dead chains.** `ropsten`, `kovan`, `rinkeby`, `goerli` are shut-down testnets; `snowtrace`/`arbiscan` moved. They get dropped and replaced by `chainid`-based selection.

---

## 2. Design of the V2 client

### 2.1 Chain map: name/id → chainid

Replace [lib/pick-chain-url.js](lib/pick-chain-url.js) (which returns a **host**) with a module that resolves a chain to a **chainid**. Keep accepting the old string keys where a live equivalent exists, so existing callers don't all break at once.

```js
// lib/chains.js
const CHAINS = {
  // canonical names → chainid
  mainnet: 1, homestead: 1, ethereum: 1,
  sepolia: 11155111,
  holesky: 17000,
  arbitrum: 42161,        // was 'api.arbiscan.io'
  optimism: 10,
  base: 8453,
  polygon: 137,
  bsc: 56,
  avalanche: 43114,       // was 'api.snowtrace.io'
};

// Retired networks — recognised so we can fail with a helpful message
// instead of a generic "unknown chain". (DECIDED: fail, don't fall back.)
const RETIRED_CHAINS = {
  ropsten: 'Ropsten was shut down in Dec 2022',
  rinkeby: 'Rinkeby was shut down in 2023',
  kovan:   'Kovan was shut down in 2023',
  goerli:  'Goerli was deprecated; use Sepolia or Holesky',
  arbitrum_rinkeby: 'Arbitrum Rinkeby was retired; use Arbitrum Sepolia',
  avalanche_fuji:   'Snowtrace moved off the Etherscan API; use chainid passthrough if needed',
};

// Accept a name OR a raw numeric chainid; default to mainnet (1).
// Throws for retired and unknown chains so callers fail fast.
function resolveChainId(chain) {
  if (chain == null || chain === '') return 1;
  if (typeof chain === 'number') return chain;
  if (/^\d+$/.test(chain)) return Number(chain);

  const key = String(chain).toLowerCase();
  if (CHAINS[key]) return CHAINS[key];

  if (RETIRED_CHAINS[key]) {
    throw new Error(
      `Chain "${chain}" is no longer supported: ${RETIRED_CHAINS[key]}. ` +
      `Supported names: ${Object.keys(CHAINS).join(', ')} (or pass a numeric chainid).`
    );
  }
  throw new Error(
    `Unknown chain "${chain}". Supported names: ${Object.keys(CHAINS).join(', ')} ` +
    `(or pass a numeric chainid).`
  );
}
```
> **DECIDED (was §6.1):** retired testnets (`ropsten`/`kovan`/`rinkeby`/`goerli`/…) **throw** a clear "no longer supported" error rather than silently falling back to mainnet — silently switching networks on a blockchain client is dangerous (wrong-chain reads look successful). Unknown names also throw. Only `null`/`''`/`undefined` defaults to mainnet, preserving today's `init(key)` behaviour. The distinct `RETIRED_CHAINS` map exists purely to give a *helpful* message ("use Sepolia or Holesky") instead of a generic "unknown chain".

### 2.2 Request layer

`init()` currently builds `baseURL: pickChainUrl(chain)` and injects `apiKey` per call. New shape: the **base URL is constant**, and **`chainid` + `apikey` are injected centrally** so individual namespaces don't repeat (and can't mis-spell) them.

```js
// lib/init.js (sketch)
const BASE_URL = 'https://api.etherscan.io/v2/api';

module.exports = function (apiKey, chain, timeout = 10000, client = null) {
  apiKey = apiKey || 'YourApiKeyToken';
  const chainid = resolveChainId(chain);
  if (!client) {
    client = axios.create({ baseURL: BASE_URL, timeout });
  }
  // getRequest now owns apikey + chainid injection
  const getRequest = require('./get-request')(client, { apikey: apiKey, chainid });
  return { log: log(getRequest), proxy: proxy(getRequest), /* … */ };
};
```

```js
// lib/get-request.js (sketch) — params come in as an object, not a pre-built string
module.exports = function (client, defaults) {
  return function getRequest(params) {
    const query = new URLSearchParams({ ...params, ...defaults }).toString();
    return client.get('?' + query).then(handleResponse); // baseURL already = /v2/api
  };
};
```

**Key structural change:** namespaces should pass a **params object** to `getRequest`, not a finished query string. Today each method does
`new URLSearchParams({ …, apiKey }).toString()` itself — that's exactly what duplicates the `apiKey` bug across 10 files. Centralising it means:
- `apikey` is spelled correctly in exactly one place,
- `chainid` is added automatically to every call,
- the namespaces get simpler.

This is a refactor of all of `lib/account.js`, `proxy.js`, `stats.js`, `block.js`, `transaction.js`, `contract.js`, `log.js` — mechanical but touches every method. Drop the per-method `apiKey` argument from the factory signatures.

### 2.3 Error handling (fold in H3 while we're here)

Normalise [get-request.js](lib/get-request.js) so **every** rejection is a typed `Error` (today the `status != 1` branch rejects with a bare string). Suggested:

```js
class EtherscanError extends Error {
  constructor(message, { result, status } = {}) {
    super(message); this.name = 'EtherscanError'; this.result = result; this.status = status;
  }
}
```
This is a **breaking change** to the error contract — call it out in the changelog and update the tests that currently `assert.equal(err, 'Contract source code not verified')`.

---

## 3. Test strategy — no live API calls

> **Hard requirement from this task: tests must not hit the live Etherscan API.**

### 3.1 Problem with today's tests
Every file in [test/](test/) calls `init(process.env.API_KEY)` and makes real HTTP requests. They need a key, are non-deterministic, are rate-limited, and (post-V1-sunset) **fail regardless of code quality**. We replace this entirely.

### 3.2 Approach: mock the HTTP boundary with `nock`
Add `nock` as a dev dependency and intercept `https://api.etherscan.io`. Because the client uses axios over real HTTP, `nock` intercepts cleanly without changing production code.

```js
// test/account.test.js
const nock = require('nock');
const { init } = require('..');

describe('account.balance', () => {
  afterEach(() => nock.cleanAll());

  it('builds a correct V2 request and resolves data', async () => {
    const scope = nock('https://api.etherscan.io')
      .get('/v2/api')
      .query(q =>
        q.chainid === '1' &&
        q.module === 'account' &&
        q.action === 'balance' &&
        q.apikey === 'TESTKEY' &&            // ← regression test for C3
        q.address === '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')
      .reply(200, { status: '1', message: 'OK', result: '42' });

    const api = init('TESTKEY');             // chain defaults to mainnet → chainid=1
    const res = await api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
    assert.equal(res.result, '42');
    scope.done();                            // asserts the interceptor was actually hit
  });
});
```

What the mocked suite must cover:
1. **Query construction** — `chainid` present and correct per chain; `apikey` lowercase; module/action/params correct for each method. This is where C3 gets a permanent guard.
2. **Chain resolution** — `resolveChainId('sepolia') === 11155111`, numeric passthrough, `null`/`''` defaults to 1, and **retired/unknown names throw** (e.g. `resolveChainId('goerli')` throws with a "use Sepolia or Holesky" message; assert on the thrown error).
3. **Success parsing** — `status:'1'` resolves `result`.
4. **Error mapping (H3)** — `status:'0'` → rejected `EtherscanError` with the `result`/message; `data.error` object → rejected Error; network failure → rejected Error. Assert on `err instanceof Error` / `err.message`, not on a bare string.
5. **`enforceNetConnect`** — call `nock.disableNetConnect()` in a global test setup so a stray un-mocked request **fails loudly** instead of silently going to the network. This is the mechanism that guarantees the requirement.

```js
// test/setup.js (loaded via .mocharc)
const nock = require('nock');
before(() => nock.disableNetConnect());
after(() => nock.enableNetConnect());
```

### 3.3 Fixtures
Record real V2 responses **once**, by hand, and store them under `test/fixtures/<chain>/<action>.json`; tests load these into `nock(...).reply(200, fixture)`. (The existing `compile.manifest.json` / `migrate.manifest.json` fixtures are unused — remove or repurpose.)

### 3.4 Optional live smoke tests (kept off by default)
Keep a tiny, **opt-in** suite that runs against the real API only when `ETHERSCAN_LIVE=1` and `API_KEY` are set, excluded from the default `npm test` and from CI's required job. This preserves a way to validate against the real endpoint without making the normal suite network-dependent.

```jsonc
// package.json scripts
"test":      "mocha --require ./test/setup.js 'test/**/*.test.js'",
"test:live": "ETHERSCAN_LIVE=1 mocha -t 20000 'test/live/**/*.test.js'"
```

---

## 4. Step-by-step execution checklist

**Phase A — Request layer (the core)**
- [ ] Add `lib/chains.js` with `resolveChainId()`; delete `lib/pick-chain-url.js`.
- [ ] Update `index.js`: export `resolveChainId`; replace `pickChainUrl` with a stub that **throws** a "removed in v11 — use resolveChainId / the chain argument" error (decision §6.4).
- [ ] Rewrite `lib/get-request.js`: accept a **params object**, inject `{ apikey, chainid }` defaults, build the query centrally, hit constant base `…/v2/api`.
- [ ] Update `lib/init.js`: constant base URL, resolve `chainid` once, stop threading `apiKey` into each namespace.

**Phase B — Namespaces (mechanical)**
- [ ] For each of `account, proxy, stats, block, transaction, contract, log`: drop the `apiKey` param, return a params object to `getRequest` (stop building the query string and stop passing `apiKey`).
- [ ] Fix `proxy.eth_getBlockByNumber` hardcoded `boolean` (review L3) while editing the file.

**Phase C — Errors**
- [ ] Add `EtherscanError`; make all rejection paths throw `Error` subclasses (H3).

**Phase D — Tests (no live calls)**
- [ ] Add `nock`; add `test/setup.js` with `disableNetConnect()`.
- [ ] Rewrite each `test/*.js` as a mocked `*.test.js`; add the `apikey`/`chainid` assertions.
- [ ] Add chain-resolution + error-mapping unit tests.
- [ ] Move the few genuinely-useful live checks to `test/live/`, gated by `ETHERSCAN_LIVE`.
- [ ] Update `.mocharc` / `package.json` scripts; remove unused fixtures.

**Phase E — Docs & release**
- [ ] README: remove "NEXTGEN… stand by" banner; replace dead-chain list and `init('YourApiKey','rinkeby'. '3000')` example with `chainid` usage; document supported chains.
- [ ] Remove dead `docs/tutorial.md` CDN/bundle snippet.
- [ ] Changelog: note breaking changes (V2 endpoint, `chainid`, error type, dropped chains).
- [ ] Bump `axios` (review H2), drop unused `querystring` (M2), move `gh-pages` to dev (M3).
- [ ] Add CI (GitHub Actions) running lint + mocked tests on supported Node versions.
- [ ] Publish as **v11.0.0** (major — breaking).

---

## 5. Backward compatibility & breaking changes

**Preserved:** the public surface — `init(apiKey, chain, timeout, client)` and the `api.<namespace>.<method>()` promise API stay the same. Custom-axios-client injection still works (just point it at the V2 base, or let `init` build it).

**Breaking (hence a major version):**
1. **Endpoint** moved to V2 — old recorded URLs / interceptors won't match.
2. **`chain` semantics** — now resolves to a `chainid`; retired testnet names no longer valid.
3. **Error type** — rejections are `Error`/`EtherscanError`, not bare strings (H3).
4. **`pickChainUrl` removed**, replaced by `resolveChainId` (the old export becomes a stub that throws a pointer error — §6.4).

---

## 6. Decisions

All resolved — no open questions blocking implementation.

1. ~~**Unknown / retired chain →** throw vs. fall back to mainnet?~~ **DECIDED: throw.** Retired names (`goerli`, `ropsten`, …) and unknown names both throw; only `null`/`''`/`undefined` defaults to mainnet. See §2.1. This is itself a breaking change for anyone currently passing a dead testnet name (they previously got a silent mainnet fallback via `pickChainUrl`).
2. ~~**Accept raw numeric `chainid`?**~~ **DECIDED: yes.** A numeric value (or all-digit string) passes straight through as the `chainid`. This future-proofs the library against new chains without a code change and matches how V2 actually keys chains — names are just sugar over ids. Already reflected in `resolveChainId` (§2.1).
3. ~~**Scope of chain map** — full 60+ vs. curated?~~ **DECIDED: curated names + numeric passthrough.** Ship the small `CHAINS` map in §2.1 (the chains people actually ask for) plus the `RETIRED_CHAINS` helper map; everything else is reachable via numeric `chainid` (decision 2). Mirroring Etherscan's full, churning 60-chain list in code would be a maintenance burden and would drift out of date — the numeric escape hatch covers the long tail for free.
4. ~~**`pickChainUrl` shim?**~~ **DECIDED: hard-remove in v11; export `resolveChainId` instead.** `pickChainUrl` returned a per-chain *host* — a concept that no longer exists in V2 (one constant base URL). A shim could only return the constant base regardless of input, which would be misleading, or the chainid, which is a different return type. Either way it's a lie, so we remove it cleanly. It's a named export, so this is a breaking change — call it out prominently in the changelog/migration note. (Cheap courtesy: keep a `pickChainUrl` export that *throws* a "removed in v11, use resolveChainId / the chain argument" Error, so upgraders get a precise pointer instead of `undefined is not a function`.)
5. ~~**Dependency changes — this PR or separate?**~~ **DECIDED: split by relevance.** Bump **`axios`** and remove the now-unused **`querystring`** *in this PR* — both are directly entangled with the request-layer rewrite (axios is the transport; querystring was the thing `URLSearchParams` replaced). The cosmetic items from the review — moving **`gh-pages`** to `devDependencies` (M3), the **license** reconciliation (M1), and the **README "NEXTGEN" banner** (M4) — are independent of V2 and land as the separate Phase-0 quick wins so this PR stays focused on the migration and its tests.

---

## 7. Effort estimate

| Phase | Work | Rough size |
|---|---|---|
| A | New request layer + chain resolver | ~½ day |
| B | Refactor 7 namespace modules | ~½ day (mechanical) |
| C | Typed errors | ~1–2 hrs |
| D | Mocked test suite + fixtures + CI wiring | ~1 day |
| E | Docs, deps, release | ~½ day |

**Total: ~2.5–3 days.** The request-layer rewrite (A) is the only conceptually hard part; B is repetitive, and D is the bulk of the typing but is what makes the project trustworthy and CI-able again.
