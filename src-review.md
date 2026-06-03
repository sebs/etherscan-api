# Code Review — `src/` (v11, TypeScript)

**Date:** 2026-06-03
**Scope:** everything under [src/](src/)
**Focus question:** *Does it reflect the complete Etherscan V2 API feature set?*

---

## ✅ Update (2026-06-03) — gaps addressed in a follow-up pass

The following findings from this review have since been **implemented** (with tests; suite now 80 passing):

- **F1 fixed** — empty results reported as `status: "0"` ("No transactions found", array result) now **resolve** instead of throwing. Genuine errors still throw.
- **New `gastracker` namespace** — `gasoracle`, `gasestimate`.
- **`transaction.gettxreceiptstatus`**, **`block.getblocknobytime` + `getblockcountdown`**, **`contract.getcontractcreation`**, **`account.token1155tx`**, **`stats.ethsupply2` + `nodecount`**, and **`getLogs` `page`/`offset`** pagination.

A second pass then addressed **F2** and added the verification + usage endpoints:

- **POST transport** — the `Transport` contract now carries an optional `method`/`body`; the built-in transport ([src/transport.ts](src/transport.ts)) does GET **and** POST. `createPostRequest` form-encodes params into the body.
- **Contract verification** — `verifysourcecode`, `verifyproxycontract` (POST) and `checkverifystatus`, `checkproxyverification` (GET).
- **`usage.getapilimit()`** — new `usage` namespace.

**Still intentionally deferred:** Pro-tier endpoints (holder lists, `addresstokenbalance`, `balancehistory`, daily stats) and beacon `getwithdrawaltxs`/`getdeposittxs`/`fundedby` (parameter shapes unverified). The matrix below reflects the *original* review state.

---

## 1. Headline answer: **No — it's a faithful port of the V1 subset, not the full V2 surface.**

The rewrite is correct and clean for what it covers, and the **`proxy` (geth) module is complete**. But the library implements only the core read endpoints inherited from the original V1 wrapper. Measured against the V2 catalog (from `https://docs.etherscan.io/llms.txt`), it's missing **one entire free module (Gas Tracker)** and several other free-tier endpoints, plus (reasonably) most Pro endpoints.

There is also a structural limit: the transport is **GET-only**, so the POST-based contract-verification endpoints can't be supported without extending it.

---

## 2. Coverage matrix (implemented vs. V2 catalog)

Legend: ✅ implemented · ⚠️ missing (free tier) · 🅿️ missing (Pro tier) · 🚫 missing (needs POST)

### account — [src/account.ts](src/account.ts)
| Action | Status |
|---|---|
| balance / balancemulti | ✅ (`balance()` handles both) |
| txlist | ✅ |
| txlistinternal | ✅ |
| tokentx (ERC-20) | ✅ |
| tokennfttx (ERC-721) | ✅ |
| getminedblocks | ✅ |
| tokenbalance | ✅ (lives here; module=account) |
| **token1155tx** (ERC-1155) | ⚠️ |
| **getwithdrawaltxs / txsbeaconwithdrawal** | ⚠️ |
| **getdeposittxs** | ⚠️ |
| **fundedby** | ⚠️ |
| addresstokenbalance / addresstokennftbalance / addresstokennftinventory | 🅿️ |
| balancehistory | 🅿️ |
| getaddresstag | 🅿️ |

### contract — [src/contract.ts](src/contract.ts)
| Action | Status |
|---|---|
| getabi | ✅ |
| getsourcecode | ✅ |
| **getcontractcreation** | ⚠️ (free, widely used) |
| verifysourcecode / checkverifystatus / verifyproxycontract / checkproxyverification / verifyvyper / verifystylus / verifyzksyncsourcecode | 🚫 (POST) |

### transaction — [src/transaction.ts](src/transaction.ts)
| Action | Status |
|---|---|
| getstatus (contract execution status) | ✅ |
| **gettxreceiptstatus** (receipt status) | ⚠️ — the natural pair to `getstatus`, free |

### block — [src/block.ts](src/block.ts)
| Action | Status |
|---|---|
| getblockreward | ✅ |
| **getblocknobytime** (block no. by timestamp) | ⚠️ (free, very common) |
| **getblockcountdown** | ⚠️ |
| daily* block stats | 🅿️ |

### logs — [src/log.ts](src/log.ts)
| Action | Status |
|---|---|
| getLogs | ✅ — but **missing `page` / `offset`** pagination params |

### proxy (geth) — [src/proxy.ts](src/proxy.ts)
**Complete ✅** — all 14 `eth_*` actions present.

### stats — [src/stats.ts](src/stats.ts)
| Action | Status |
|---|---|
| ethsupply | ✅ |
| ethprice | ✅ |
| tokensupply | ✅ (module=stats) |
| **ethsupply2** | ⚠️ |
| **nodecount** | ⚠️ |
| chainsize / ethdailyprice / daily* | 🅿️ |

### gastracker — *no namespace exists*
| Action | Status |
|---|---|
| **gasoracle** (current safe/propose/fast gas) | ⚠️ — popular, free, **whole module missing** |
| **gasestimate** | ⚠️ |
| daily gas stats | 🅿️ |

### tokens
`tokenbalance` ✅ and `tokensupply` ✅ are covered (under account/stats). The rest — `tokeninfo`, `tokenholderlist`, `toptokenholders`, `tokenholdercount`, `*history` — are 🅿️ Pro.

### misc
`getapilimit` (check your rate-limit budget, free) ⚠️; `chainlist` (utility) ⚠️.

**Summary:** free-tier gaps worth closing first — `gastracker` module (`gasoracle`, `gasestimate`), `transaction.gettxreceiptstatus`, `block.getblocknobytime` + `getblockcountdown`, `contract.getcontractcreation`, `account.token1155tx`, `stats.ethsupply2` + `nodecount`, `getLogs` pagination, `getapilimit`.

---

## 3. Correctness / quality findings

### 🟠 F1 — "No transactions found" is thrown as an error
[src/get-request.ts](src/get-request.ts): `if (data.status !== undefined && String(data.status) !== '1')` throws an `EtherscanError`. But Etherscan returns a legitimately **empty** result as `{"status":"0","message":"No transactions found","result":[]}`. So calling `txlist` / `tokentx` on an address with no history **rejects** instead of resolving with `[]`. This is a long-standing wart inherited from the V1 client and the most likely thing to surprise consumers.
*Fix:* when `status === '0'` and `message` matches `/No (transactions|records) found/i` (and/or `Array.isArray(result)`), resolve with `data` instead of throwing.

### 🟡 F2 — GET-only transport caps the achievable API surface
[src/http-get.ts](src/http-get.ts) only does GET. All verification endpoints (`verifysourcecode`, …) are POST, so they're unreachable by design. If verification is ever in scope, the `Transport` type and `createGetRequest` need a POST path. Worth a one-line note in the README so it's a known boundary, not a surprise.

### 🟡 F3 — Loose response typing undersells the TS port
Every method returns `Promise<EtherscanResponse>` with `result: unknown` and an index signature. For a TS-first library, consumers get no shape for `result`. Consider per-endpoint result generics (e.g. `balance(): Promise<EtherscanResponse<string>>`) or at least typed aliases for the common shapes. Not a bug — a missed opportunity.

### 🟢 F4 — `getLogs` lacks pagination
[src/log.ts](src/log.ts) omits `page`/`offset`, which V2 `getLogs` supports. Add them as trailing optional params for parity with `txlist`.

### 🟢 F5 — `http-get` robustness niceties
[src/http-get.ts](src/http-get.ts): no `res.on('error', …)` handler (a mid-stream socket error won't reject cleanly); no `User-Agent` header; error on non-2xx discards the response body (which often contains a useful message). All minor, none blocking.

### 🟢 F6 — No client-side rate-limit / retry
Etherscan free tier is ~5 req/s; the client doesn't throttle or back off on `Max rate limit reached`. Fine for a thin client, but worth documenting.

### ✅ What's solid
Central `apikey`/`chainid` injection (kills the old casing bug), typed `EtherscanError`, fail-fast `resolveChainId`, injectable transport, clean ESM module boundaries, strict tsconfig. The architecture is right; the gaps are breadth, not depth.

---

## 4. Recommendation

The port is **production-correct for what it implements**, but to honestly claim "Etherscan V2 client" it should close the **free-tier gaps** in §2 (especially the missing `gastracker` namespace and `gettxreceiptstatus` / `getblocknobytime` / `getcontractcreation`) and fix **F1** (empty-result-as-error). Pro endpoints and POST verification can be explicitly scoped out in the README.

Suggested order: **F1 (bug)** → `gastracker` namespace → the handful of free single-action gaps → `getLogs` pagination → typing/robustness polish.
