# etherscan-api — Project Review

**Date:** 2026-06-03
**Reviewed version:** 10.3.0
**Reviewer:** Code review for project revival
**Status going in:** Archived since 2024, ~884 LOC of library code, CommonJS, promise-based wrapper around the Etherscan REST API.

---

## 1. Executive summary

`etherscan-api` is a small, focused, promise-based client for the Etherscan REST API. The architecture is clean and easy to follow: `init()` wires up an axios client and hands a shared `getRequest` function to a set of namespace modules (`account`, `proxy`, `stats`, `block`, `transaction`, `contract`, `log`). For its era it is well-organised.

However, the project cannot be revived "as-is". The single most important problem is **external**: Etherscan retired the V1 per-chain API that this entire library is built on. On top of that there is a likely **latent auth bug** (the API key is sent under the wrong parameter name), a **test suite that only runs against the live network** (no mocks, needs a real key, non-deterministic), and **stale dependencies/docs**. None of these are fatal — the bones are good — but a revival is really a **V2 modernization**, not a dusting-off.

**Recommendation:** Revive as a deliberate **v11 / "next" major** with a V2 API rewrite of the request layer, a mocked test suite, TypeScript types, and a dependency refresh. Keep the namespace API shape for backward compatibility where possible.

---

## 2. Severity-ranked findings

### 🔴 Critical — blocks revival

**C1. Built on the deprecated Etherscan V1 / per-subdomain API.**
[lib/pick-chain-url.js](lib/pick-chain-url.js) maps chains to host subdomains (`api-ropsten.etherscan.io`, `api-kovan…`, `api.arbiscan.io`, `api.snowtrace.io`, …). Etherscan has consolidated onto a **single V2 endpoint** of the form `https://api.etherscan.io/v2/api?chainid=<id>&…`, and the legacy per-chain hosts are being/have been sunset. This is the central thing to fix — every request the library builds targets the old shape.
*Action:* Rewrite the request/URL layer for V2: one base URL, a `chainid` query param, and a chain→id map (1 = mainnet, 11155111 = Sepolia, 42161 = Arbitrum One, 43114 = Avalanche C-Chain, etc.).

**C2. Most advertised chains are dead networks.**
`ropsten`, `kovan`, `rinkeby`, `goerli` are all **deprecated/shut-down Ethereum testnets**. Goerli is wound down; the current public testnets are **Sepolia** and **Holešky/Hoodi**. The README and `pick-chain-url.js` still advertise the dead ones as first-class. `snowtrace`/`arbiscan` also moved (Snowtrace now runs on Routescan; Arbiscan is reachable via V2 `chainid`).
*Action:* Drop dead testnets, model chains by `chainid`, document only live networks.

**C3. Likely broken API-key parameter (latent auth bug).**
Every namespace builds its query with the object shorthand `{ module, action, apiKey, … }`, e.g. [lib/account.js:57](lib/account.js#L57). `URLSearchParams` serialises that key **verbatim** as `apiKey=…`, but Etherscan expects the lowercase **`apikey=…`**. If confirmed, requests are effectively unauthenticated and silently fall back to the strict anonymous rate limit — which also helps explain why the live tests are flaky/slow. This was masked because the default value is the literal `'YourApiKeyToken'`.
*Action:* Verify against the live API; rename the serialised param to `apikey`. Add a regression test that asserts the built query string.

### 🟠 High

**H1. Tests only run against the live network.**
Every test in [test/](test/) does `init(process.env.API_KEY)` and makes real HTTP calls (`mocha -t 20000`). Consequences: needs a real key, non-deterministic, rate-limited, slow, and **green only when Etherscan is up and the endpoints still exist** (see C1). There is no HTTP mocking layer and the two fixtures in `test/fixtures/` (`compile.manifest.json`, `migrate.manifest.json`) appear unused.
*Action:* Introduce `nock` (or msw) with recorded fixtures; keep a small, opt-in live smoke-test suite behind an env flag.

**H2. Vulnerable / outdated runtime dependencies.**
`axios@1.2.2` (latest 1.17.0) sits below the fixes for several disclosed advisories (SSRF / credential-leak on redirect, CSRF token handling, ReDoS). `gh-pages@5.0.0` (latest 6.3.0). The repo history is full of `snyk-fix-*` branches, confirming this has been an ongoing pain point.
*Action:* Bump `axios` to current 1.x, run `npm audit`, regenerate the lockfile.

**H3. Inconsistent rejection types break the error contract.**
In [lib/get-request.js](lib/get-request.js) the `status != 1` branch rejects with a **plain string** (`reject(returnMessage)`), while the `data.error` and network-failure branches reject with an **`Error`**. Callers can't reliably `catch (e) { e.message }`. The existing tests even encode the string behaviour (`assert.equal(err, 'Contract source code not verified')`), so fixing this is a deliberate breaking change.
*Action:* Always reject with a typed `Error` (consider an `EtherscanError` carrying `result`/`status`); update tests.

### 🟡 Medium

**M1. License metadata is contradictory.** `package.json` says `"license": "ISC"`, but [LICENSE.md](LICENSE.md) is **MIT** ("Copyright (c) 2015 these people"), the `author` field is empty, and the copyright holder is a placeholder. Pick one (MIT is what's shipped), fix the SPDX id, set a real author/holder.

**M2. Dead / unused dependency.** `querystring` is still a dependency but the code was migrated to `URLSearchParams` (commit `479a3fb`). It's also a deprecated legacy module. Remove it.

**M3. `gh-pages` is a runtime dependency.** It's only used by [scripts/publish-gh.js](scripts/publish-gh.js) for docs publishing — it belongs in `devDependencies`, not `dependencies` shipped to consumers.

**M4. Stale docs reference removed features.** [docs/tutorial.md](docs/tutorial.md) points to `dist/bundle.js` via jsDelivr, but the bundle step was removed (commit `ca833a3`), so the CDN snippet 404s. It also has a typo: `ttps://`. The README still carries the banner *"Development of a NEXTGEN Version has started — please stand by"* and a malformed example: `init('YourApiKey','rinkeby'. '3000')` (period instead of comma; `rinkeby` is dead per C2).

**M5. No CI.** Travis was removed (commit `5d11776`) and nothing replaced it; there are no `.github/workflows`. A revived project needs CI running lint + the (to-be-mocked) tests on supported Node versions.

**M6. Required-vs-optional parameter mismatches.** `block.getblockreward(address, blockno)` treats `address` as required, yet [test/methods-test.js](test/methods-test.js) calls `api.block.getblockreward()` with no args. Several methods don't validate inputs at all (e.g. `balance()` with no address just builds `address=undefined`). Decide on a validation policy and apply it consistently.

### 🟢 Low / polish

- **L1.** Inconsistent `var`/`let`/`const` usage throughout `lib/` — standardise on `const`/`let`.
- **L2.** Tooling is dated: **jshint** (`.jshintrc`, `esversion: 6`) is effectively unmaintained. Move to ESLint + a modern target.
- **L3.** `proxy.eth_getBlockByNumber` hardcodes `boolean = true` (the txn-detail flag) with no way to request `false`.
- **L4.** `loose` equality in [get-request.js:21](lib/get-request.js#L21) (`data.status != 1`) — prefer strict comparison with normalised types.
- **L5.** Abandoned-rewrite branches on the remote (`etherscan-api-next`, `monorepo`, `fix-docs`) — fold the useful parts in and prune, so the revival has one clear line of work.
- **L6.** No `engines` field in `package.json`; declare the supported Node range.
- **L7.** JSDoc typos/copy-paste in comments (`@xample`, `sepcific`, `mineds`, `tag - ??`).

---

## 3. Architecture notes (what to keep)

The core design is genuinely good and worth preserving:

- **Dependency-injected request function.** `init()` builds one axios client and threads a single `getRequest` into every namespace ([lib/init.js](lib/init.js)). This makes the modules trivial to test once `getRequest` is mockable, and it already supports a **caller-supplied axios client** (nice for timeouts/interceptors — see the README "use your own instance of axios" section).
- **Flat namespace modules.** Each file (`account`, `proxy`, `stats`, …) is a pure factory `(getRequest, apiKey) => ({ method… })`. Easy to read, easy to extend.
- **Promise-first public API.** Clean for consumers; just needs the rejection-type fix (H3).

A V2 rewrite can keep this exact shape — only the URL/param construction inside `getRequest` and `pick-chain-url` needs to change.

---

## 4. Proposed revival roadmap

**Phase 0 — Make it runnable & honest (small).**
Fix license (M1), remove `querystring` (M2), move `gh-pages` to dev (M3), remove the stale README/tutorial claims (M4), add `engines`.

**Phase 1 — Trustworthy tests (high value).**
Add `nock`-based mocked tests so the suite runs offline and deterministically in CI (H1). Add a query-string assertion test that catches C3. Wire up GitHub Actions (M5).

**Phase 2 — Etherscan V2 migration (the real work).**
Rewrite `getRequest` + `pick-chain-url` for the single V2 endpoint + `chainid` (C1, C2). Confirm and fix the `apikey` casing (C3). Map chains by id; drop dead testnets.

**Phase 3 — Hardening & DX.**
Bump `axios`, run `npm audit` (H2). Normalise error handling to typed errors (H3). Add TypeScript declaration files (`.d.ts`) — high leverage for a thin API client. Replace jshint with ESLint (L2).

**Phase 4 — Release.**
Ship as a **major version** (V2 endpoint + error-contract change are breaking). Refresh README with a migration note, update generated docs, and publish.

---

## 5. Quick wins (can land today, low risk)

1. Remove `querystring` from `dependencies`.
2. Move `gh-pages` to `devDependencies`.
3. Reconcile the license to MIT in `package.json`; set a real author/holder.
4. Delete the "NEXTGEN … stand by" banner and fix the `init(...'rinkeby'. '3000')` typo in the README.
5. Fix `docs/tutorial.md` (remove the dead `dist/bundle.js` CDN snippet; fix `ttps://`).
6. Add an `engines.node` field.

---

## 6. Risk callout for maintainers

The library's value proposition depends entirely on Etherscan's API, which has **already broken backward compatibility once** (V1→V2). Before investing in Phases 2–4, confirm: (a) the V2 endpoint shape and chain-id list, (b) whether the free-tier auth/rate-limit model still fits this library's "just give it a key" UX, and (c) that Etherscan's terms still permit this kind of thin client. The rewrite is straightforward; the dependency on a third party's roadmap is the standing risk.
