2026-07-02
==========

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
  * Merge pull request [#95](https://github.com/sebs/etherscan-api/issues/95) from mochimisu/master
    support for etherscan's tokennfttx api for ERC721 tokens
  * Merge pull request [#102](https://github.com/sebs/etherscan-api/issues/102) from Jason-Wanxt/master
    Add Arbitrum support
  * Merge pull request [#106](https://github.com/sebs/etherscan-api/issues/106) from sebs/dependabot/npm_and_yarn/async-2.6.4
    Bump async from 2.6.3 to 2.6.4

2022-04-27
==========

  * Bump async from 2.6.3 to 2.6.4
    Bumps [async](https://github.com/caolan/async) from 2.6.3 to 2.6.4.
    - [Release notes](https://github.com/caolan/async/releases)
    - [Changelog](https://github.com/caolan/async/blob/v2.6.4/CHANGELOG.md)
    - [Commits](https://github.com/caolan/async/compare/v2.6.3...v2.6.4)
    ---
    updated-dependencies:
    - dependency-name: async
    dependency-type: indirect
    ...
    Signed-off-by: dependabot[bot] <support@github.com>

2022-02-22
==========

  * edit the urls of arbiscan
  * Add arbitrum support
  * Update Readme.md
  * Add arbscan support

2021-06-25
==========

  * quick test for tokennfttx

2021-06-24
==========

  * add tokennfttx to accounts

2021-02-16
==========

  * Fixed [#84](https://github.com/sebs/etherscan-api/issues/84)

2020-12-20
==========

  * Merge pull request [#66](https://github.com/sebs/etherscan-api/issues/66) from sebs/dependabot/npm_and_yarn/acorn-5.7.4
    Bump acorn from 5.7.3 to 5.7.4
  * Merge pull request [#71](https://github.com/sebs/etherscan-api/issues/71) from sebs/dependabot/npm_and_yarn/websocket-extensions-0.1.4
    Bump websocket-extensions from 0.1.3 to 0.1.4
  * Merge pull request [#72](https://github.com/sebs/etherscan-api/issues/72) from sebs/dependabot/npm_and_yarn/elliptic-6.5.3
    Bump elliptic from 6.5.0 to 6.5.3
  * Merge pull request [#74](https://github.com/sebs/etherscan-api/issues/74) from sebs/dependabot/npm_and_yarn/highlight.js-9.18.5
    Bump highlight.js from 9.15.9 to 9.18.5
  * Merge pull request [#75](https://github.com/sebs/etherscan-api/issues/75) from sebs/dependabot/npm_and_yarn/ini-1.3.7
    Bump ini from 1.3.5 to 1.3.7

2020-12-11
==========

  * Bump ini from 1.3.5 to 1.3.7
    Bumps [ini](https://github.com/isaacs/ini) from 1.3.5 to 1.3.7.
    - [Release notes](https://github.com/isaacs/ini/releases)
    - [Commits](https://github.com/isaacs/ini/compare/v1.3.5...v1.3.7)
    Signed-off-by: dependabot[bot] <support@github.com>

2020-11-25
==========

  * Bump highlight.js from 9.15.9 to 9.18.5
    Bumps [highlight.js](https://github.com/highlightjs/highlight.js) from 9.15.9 to 9.18.5.
    - [Release notes](https://github.com/highlightjs/highlight.js/releases)
    - [Changelog](https://github.com/highlightjs/highlight.js/blob/9.18.5/CHANGES.md)
    - [Commits](https://github.com/highlightjs/highlight.js/compare/9.15.9...9.18.5)
    Signed-off-by: dependabot[bot] <support@github.com>

2020-07-29
==========

  * Bump elliptic from 6.5.0 to 6.5.3
    Bumps [elliptic](https://github.com/indutny/elliptic) from 6.5.0 to 6.5.3.
    - [Release notes](https://github.com/indutny/elliptic/releases)
    - [Commits](https://github.com/indutny/elliptic/compare/v6.5.0...v6.5.3)
    Signed-off-by: dependabot[bot] <support@github.com>

2020-06-06
==========

  * Bump websocket-extensions from 0.1.3 to 0.1.4
    Bumps [websocket-extensions](https://github.com/faye/websocket-extensions-node) from 0.1.3 to 0.1.4.
    - [Release notes](https://github.com/faye/websocket-extensions-node/releases)
    - [Changelog](https://github.com/faye/websocket-extensions-node/blob/master/CHANGELOG.md)
    - [Commits](https://github.com/faye/websocket-extensions-node/compare/0.1.3...0.1.4)
    Signed-off-by: dependabot[bot] <support@github.com>
