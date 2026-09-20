2026-09-20
==========

  * fix: make npm test run on node 20
    The test script passed a quoted glob, 'test/**/*.test.js'. node --test
    only learned to expand globs after node 20, so on node 20 it looked for a
    file with that literal name and exited 1:
    Could not find '.../test/**/*.test.js'
    package.json declares engines >=20 and CI has 20.x in its matrix, so
    `npm test` had never worked there. It went unnoticed because CI ran its
    own unquoted `node --test test/*.test.js`, which bash expanded first —
    the same line that skipped every namespace directory.
    Use bare `node --test` and let node discover the files: identical results
    on 20, 22, 24 and 26 (579 tests). It also picks up test/helpers.js, which
    defines no tests but is now checked to import cleanly.
    Drop fs.globSync from the package guard for the same reason (node 22+),
    and resolve a script's literal path prefix so a reintroduced test:live
    pointing at a missing directory still fails.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * chore: untrack the generated lib/ build output
    .gitignore lists lib/ and prepare builds it, but 11 compiled .js files
    were still tracked from before that rule — an incomplete, stale snapshot
    (no index.js, no .d.ts) that nothing consumes: npm publish takes lib/ from
    disk via .npmignore, git-url installs run prepare, and every workflow runs
    npm test, whose pretest rebuilds it.
    Editing src/ therefore dirtied tracked build artifacts on every change.
    Untrack them so the ignore rule takes effect.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * fix: run the whole test suite in CI
    The CI workflow ran `node --test test/*.test.js`, which matches only the
    six top-level test files and skipped every namespace directory —
    test/account, test/block, test/contract, test/proxy, test/stats,
    test/transaction, test/gastracker and test/usage. CI was green over 128
    of 573 tests.
    Call `npm test` so CI and local runs share one glob, and extend the
    package guard to fail when a workflow runs a narrower one.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * docs: correct the claim that POST urls carry the api key
    The security note said the key is part of "POST request URLs". It is not:
    createPostRequest form-encodes apikey into the body and leaves the URL as
    a bare /v2/api. The note overstated the exposure it asks readers to guard
    against.
    Say where the key actually travels, and pin the behaviour with a test so
    the note cannot drift back out of date.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * fix: validate numeric chainids instead of passing them through
    Numbers went into the query string untouched, so init('KEY', NaN) sent
    chainid=NaN, and -1, 1.5, Infinity and values past the safe-integer range
    went the same way — a server-side failure with nothing pointing back at
    the cause. String input was already strict ('0x1' and '1e3' both throw),
    so the two paths disagreed.
    Require a positive safe integer, and reject a non-string/non-number chain
    with a clear message rather than the "chain.toLowerCase is not a
    function" TypeError plain-JS callers used to get.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * fix: keep the Etherscan error message on a non-2xx response
    A non-2xx response was rejected with a bare "Request failed with status
    code 403", throwing away a body that often explains the failure — for
    rate limiting, "Max rate limit reached".
    Append the parsed body's result/message. Only a JSON object's own string
    fields are used, so an HTML error page cannot echo the request URL, and
    with it the API key, into the error message. A non-JSON body keeps the
    bare status-code message as before.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * fix: drop the test:live script that ran no tests
    test/live/ does not exist, so `npm run test:live` globbed nothing,
    reported "tests 0" and exited 0 — a green run that tested nothing, which
    in CI reads as a passing live suite.
    Remove the script and its README line, and add a guard that fails if any
    `node --test` script in package.json points at a glob matching no files.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * fix: export httpTransport so its documented options are reachable
    The README documents maxResponseBytes and allowInsecure as transport
    options a caller can override, but nothing in the library ever passes
    them: createGetRequest, createPostRequest and createRawGet all send
    { timeout } only. The default transport was not exported either — the
    package exports map exposes "." alone, so
    `import('etherscan-api/lib/transport.js')` failed with
    ERR_PACKAGE_PATH_NOT_EXPORTED and it could not even be wrapped.
    Export it as httpTransport and document the wrapping pattern.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * fix: reject a non-object response body with EtherscanError
    A body of null (valid JSON, and what some proxies and WAFs return) or a
    custom transport resolving with undefined reached the property reads in
    normalize and threw
    TypeError: Cannot read properties of null (reading 'status')
    Callers catching EtherscanError missed it and the message said nothing
    about the request. Guard the shape up front and throw the library's own
    error, carrying the offending body as result. Arrays still pass through.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * fix: stop the "no ... found" heuristic swallowing real errors
    A status "0" response was treated as an empty (successful) result whenever
    its message matched /no ... found/, regardless of what result held. So
    { status: "0", message: "No records found",
    result: "Error! Invalid address format" }
    resolved, handing the caller the error string as if it were data.
    Apply the message heuristic only when result carries no payload. The
    Array.isArray branch, which covers the common empty-list case, is unchanged.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * fix: keep block 0 and page/offset 0 in log.getLogs
    getLogs used truthy checks to decide which optional params to send, so a
    fromBlock/toBlock of 0 (the genesis block) was silently dropped and the
    query ran unbounded over the whole chain instead of the requested range.
    page/offset of 0 were dropped the same way.
    Drop only omitted values (undefined/null/''), matching how account.ts
    listRange already handles the same parameters with ??.
    Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  * 12.0.5
  * changelog

2026-09-11
==========

  * docs: add sponspors section
  * fix: corret location for funding
  * chore: audit fix deps
  * chore: add funding.yml
  * 12.0.4
  * changelog
  * chore: add sponsor info

2026-07-02
==========

  * 12.0.3
  * changelog
  * refactor(account,proxy): bind module via a local call helper
    Each namespace restated its module string on every request. Add a local
    `call<T>(action, params)` closure that binds module ('account' / 'proxy') once,
    so methods name only their action and params. Public method signatures, JSDoc
    and result generics are unchanged; behaviour is identical (call spreads into the
    same getRequest, so the prototype-pollution guard in serialize() still applies).
    module:'account' and module:'proxy' now each appear exactly once.
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  * refactor(account): collapse beacon/L2 trio into a shared factory
    txsBeaconWithdrawal/getdeposittxs/getwithdrawaltxs were identical apart from the
    action string (same signature, same untyped EtherscanResponse return). Generate
    them from a pagedByAddress(action) factory in the account() closure; each keeps
    its JSDoc via the property. No public-API or behaviour change.
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  * refactor(account): collapse token-transfer trio into a shared worker
    tokentx/tokennfttx/token1155tx were byte-identical apart from the action string
    and result type. Introduce a private generic tokenTransfers<T>(action, ...)
    worker in the account() closure; the three public methods keep their full
    signatures, JSDoc and distinct Erc20/721/1155 return generics and delegate in
    one line. No public-API or behaviour change.
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  * refactor(account): extract listRange helper for shared paging defaults
    The startblock/endblock/page/offset/sort default block was restated verbatim
    at 7 sites (txlist, tokentx, tokennfttx, token1155tx, txsBeaconWithdrawal,
    getdeposittxs, getwithdrawaltxs). Extract a module-scoped listRange() mutator
    (mirroring the existing applyFilter helper) and apply it everywhere. sort keeps
    `|| 'asc'` (empty string coerces to 'asc'); txlistinternal and txnbridge have a
    different shape and are left untouched. Behaviour-preserving: same params/values,
    and requests are asserted via URLSearchParams.get() so key order is irrelevant.
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  * test: refactor to one-assert-per-test, split per endpoint
    Reorganises the test suite around the conventions:
    - one assertion per `it()`, with shared setup moved into `beforeEach`
    - one endpoint per file; namespaces with multiple endpoints get a folder
    (test/account, test/stats, test/block, test/transaction, test/contract,
    test/usage, test/proxy, test/gastracker); single-endpoint namespaces stay
    flat (test/log.test.js, test/chains.test.js, ...)
    - descriptive test names stating exactly what each assertion checks
    The old flat files (account/misc/proxy/gastracker) are split accordingly;
    chains/index/request/transport are refactored in place. Coverage is preserved
    one-for-one (every original param/result/rejection assertion reappears as its
    own test). Test runner glob updated to recurse: `node --test 'test/**/*.test.js'`.
    539 tests pass; no src/lib changes.
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  * chore: removed doc
  * feat(account): support advanced-filter params on transaction lists
    Adds optional `from`/`to`/`fromto_opr` advanced-filter fields (Beta) to
    txlist, txlistinternal, tokentx, tokennfttx and token1155tx via a trailing
    `AdvancedFilter` argument, letting callers filter by sender/recipient instead
    of a single address. `address` is now optional on these methods and is only
    sent when provided, so filter-only queries work. Exposes and re-exports the
    `AdvancedFilter` type and adds unit tests.
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  * feat(account): add txnbridge endpoint
    Adds the free-tier `account.txnbridge` action, returning Plasma bridge
    deposit transactions received by an address (Polygon, Gnosis, BitTorrent
    Chain). Takes address/page/offset only — no block range or sort. Includes a
    unit test.
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  * feat(stats): add chainsize endpoint
    Adds the free-tier `stats.chainsize` action, returning the blockchain size
    in bytes sampled daily over a date range, with clienttype/syncmode/sort
    options. Includes the `ChainSize` result type (re-exported) and unit tests.
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  * feat(block): add getblocktxnscount endpoint
    Adds the free-tier `block.getblocktxnscount` action, returning per-type
    transaction counts (normal / internal / ERC-20 / ERC-721 / ERC-1155) for a
    block. Includes the `BlockTransactionCount` result type (re-exported) and a
    unit test.
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

2026-06-28
==========

  * 12.0.2
  * changelog
  * security: harden default transport and param serialization
    Address the actionable findings from the security review (sec-review.md):
    - F-2: cap the default transport's response body (50MB default,
    configurable via maxResponseBytes) and abort + reject on exceed,
    guarding against memory-exhaustion from an oversized response.
    - F-3: refuse cleartext http:// by default; opt in with allowInsecure.
    Scheme is detected via new URL().protocol so the check is robust to
    case/whitespace, and the refusal error omits the URL to avoid leaking
    the apikey.
    - F-5: filter __proto__/constructor/prototype keys in serialize() and
    verifyBody() as defense-in-depth against prototype pollution on the
    arbitrary [key: string] verification-param passthrough.
    - F-1: document in the README that the apikey travels in the request
    URL and warn against logging full request URLs.
    Transport now settles exactly once with a res 'error' handler, fixing a
    process crash (uncaughtException) and a truncated-resolve on single-chunk
    over-cap responses. F-4 (linear regex) and F-6 (verbatim forwarding) need
    no action per the review.
    Tests: +6 covering the body cap (single- and multi-chunk), cleartext
    refusal (incl. case-insensitivity and no key leak), and key filtering.
    102/102 pass; typecheck clean.
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

2026-06-03
==========

  * 12.0.1
  * changelog
  * fix: a lot of small fixes around the 100.0.0 version
  * chore: added npmignore
  * 12.0.0
  * feature: free api widely covered
  * feature: more v2 features added
  * docs: cleanup
  * refactor: docs on tag
  * refactor: documentation
  * chore: inlined doc tools
  * refactor: get rid of nock
  * refactor: remove axios
  * feature: pipeline
  * refactor: node internal test runner and asserts used
  * feature: support v2 api from etherscan
  * docs: prepare phase 2

2023-01-24
==========

  * Merge pull request [#120](https://github.com/sebs/etherscan-api/issues/120) from sebs/snyk-fix-a2fe87df9f3e02c8599d49bcb7f6adcb
    [Snyk] Security upgrade gh-pages from 4.0.0 to 5.0.0

2023-01-23
==========

  * fix: package.json & package-lock.json to reduce vulnerabilities
    The following vulnerabilities are fixed with an upgrade:
    - https://snyk.io/vuln/SNYK-JS-GHPAGES-3042993

2023-01-07
==========

  * chore: do not publish jsdoc config and extra md file
  * 10.3.0
  * changelog
  * fix: refactoring errors and linting
  * refactor: remove bundle step
  * refactor: replace querystring with URLSearchParams
  * 10.2.2
  * docs: remove travis build status
  * docs: Document Chain Explrers and api urls

2023-01-06
==========

  * 10.2.1
  * changelog
  * ichore: update deps

2022-09-20
==========

  * Merge pull request [#113](https://github.com/sebs/etherscan-api/issues/113) from carletex/patch-1
    Add Goerli and Sepolia to the API URL list
  * Merge pull request [#116](https://github.com/sebs/etherscan-api/issues/116) from peterferguson/add-avalanche
    Add Avalanche fixes [#115](https://github.com/sebs/etherscan-api/issues/115)

2022-09-19
==========

  * Add Avalanche fixes [#115](https://github.com/sebs/etherscan-api/issues/115)
    Add urls for avalanche mainnet and fuji testnet

2022-08-26
==========

  * Add Goerli and Sepolia to the API list
    Hey @sebs 
    Thanks a lot for this amazing library.
    I created this PR to include the Sepolia and Goerli API endpoints. Currently I'm creating the client (with `axios.create`) to support those two, but I'd be cool if I have directly included on the library.
    Thanks!

2022-07-03
==========

  * 10.2.0
  * changelog
  * feature: make it possible to pass a vlient to the init function
    * add a test
    * make pickChainUrl method availabale to the consumer
    * move some code around a bit to simplify adding a client

2022-06-26
==========

  * 10.1.0
  * changelog
  * feature: add getsourcecode method
  * fix: make tests work better
    * skip what needs skipping with a comment
    * replace xit with .skip
  * refactor: explicitly generate the query
  * fix: use the passed api key  for tests so we dont hit limits

2022-05-28
==========

  * 10.0.9
  * changelog
  * refactor: do pusblish even less stuff
  * 10.0.8
  * refactor: make package smaller
  * chore: removed idea files
  * 10.0.7
  * bundle
  * 10.0.6
  * refactor: remove direct dependencies and use npx for some of the lesser
    used commands
  * remove traviremove traviss
  * update deps
  * refactor: make tests executable with a external api key

2022-05-27
==========

  * Merge pull request [#85](https://github.com/sebs/etherscan-api/issues/85) from Catzilla/fix-84
    Fixed [#84](https://github.com/sebs/etherscan-api/issues/84)
