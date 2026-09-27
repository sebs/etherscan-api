2026-09-27
==========

  * chore: add findings.md to gitignore
  * test: inline the type-test fixture and drop the test-d folder
    The consumer fixture sat in a top-level test-d/ folder because node
    --test runs .ts files it finds under test/. Keep everything under test/
    instead: types.test.js now holds the consumer source, writes it and a
    tsconfig to a temp dir, and compiles it there with tsc.
    Compiling outside the repo also keeps this repo's @types/node out of
    reach, so the declarations must stand alone for consumers.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * build: test pull requests in CI, drop rm from scripts, export package.json
    - ci.yml triggered only on push, so pull requests from forks never ran
    the test matrix before review. Add pull_request.
    - prebuild and clean used rm -rf, so npm run build (and npm test through
    pretest) failed in Windows shells. Use fs.rmSync via node -e.
    - exports did not expose ./package.json, so
    import('etherscan-api/package.json') failed with
    ERR_PACKAGE_PATH_NOT_EXPORTED for tools reading the installed version.
    Tests in package.test.js pin all three.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * docs: correct the transport options claim and check res.ok in fetch examples
    The Readme said init only ever passes timeout to the transport, but the
    POST verification endpoints also pass method and body, which the fetch
    example right above depends on.
    Both fetch-based transport examples (Readme and examples.md) returned
    res.json() without checking res.ok, so copied as-is a 5xx HTML page
    became a JSON parse error and the HTTP status was lost. They now throw
    on a non-2xx status.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(account,contract): reject out-of-range address lists before calling the API
    balance([]) sent action=balancemulti&address= to Etherscan, and lists
    longer than Etherscan's limits (20 for balancemulti, 5 for
    getcontractcreation, which the JSDoc already states) went out as-is and
    failed remotely, costing a rate-limited call.
    Both now reject (without a request) when given an empty list or more
    addresses than the endpoint accepts.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(types): catch misspelt verification fields and a missing tokenbalance address
    VerifyParams ended in [key: string]: string | number | undefined, so any
    field name type-checked. verifysourcecode({ ..., optimisationUsed: 1 })
    compiled, and the field was sent under a name Etherscan ignores, so the
    optimiser was treated as off. tokenbalance(address?, ...) made the
    address optional, so tokenbalance() compiled.
    VerifyParams now lists its fields explicitly (codeformat,
    compilerversion, evmversion, compilermode and zksolcVersion move into the
    shared interface) plus template-literal keys for libraryname<N> and
    libraryaddress<N>. Runtime forwarding is unchanged. tokenbalance's
    address is required. Both are pinned in test-d/consumer.ts.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(account): type balance() per argument with overloads
    balance() always returned EtherscanResponse<string | MultiBalanceItem[]>,
    so a strict TypeScript caller could not assign a single balance to a
    string or read .balance from a multi result without a cast, although
    examples.md presents both as typed per call.
    Overloads now return string for a single address, MultiBalanceItem[]
    for an array, and the union for a string | string[] argument.
    A new type test (test/types.test.js) compiles test-d/consumer.ts
    against lib/*.d.ts with tsc to pin this. The fixture lives outside
    test/ because node --test runs .ts files found there.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(transport): honour maxResponseBytes: 0 and reject invalid values
    options.maxResponseBytes || DEFAULT turned an explicit 0 into 50 MB,
    silently discarding the caller's value. A negative value made every
    response fail with a confusing size error, and NaN disabled the cap
    (no comparison with NaN is true).
    Use ?? so 0 means 'reject any non-empty body', and reject negative or
    NaN values up front.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(init,transport): validate the timeout instead of patching over it
    init(key, chain, 0) silently became a 10 s timeout, because || discards
    0. init(key, chain, -5) or Infinity passed straight through, and the
    default transport then rejected with Node's raw RangeError
    ERR_OUT_OF_RANGE. Values above 2^31-1 ms would fire after 1 ms under
    the new deadline timer.
    A shared resolveTimeout() now treats undefined/null as the 10 s default
    and rejects anything that is not a positive finite number within Node's
    timer range. init() throws at construction; the transport rejects with
    the same message.
    BREAKING CHANGE: init() throws for a timeout of 0, which used to mean
    the default. Omit the argument or pass null instead.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(chains): trim chain names and accept 0x hex chain ids
    Names were lower-cased but not trimmed, so ' sepolia ' or 'base\n' (a
    value read from an env or config file) was an unknown chain. And '0x1',
    the EIP-155 hex form that eth_chainId returns, was an unknown chain
    rather than a chain id.
    Trim before matching, and parse 0x-prefixed hex strings as chain ids
    with the same positive-integer validation. A whitespace-only string is
    still an error, and leading zeros ('007') are still accepted.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(chains): report a BigInt chainid clearly instead of crashing
    The invalid-chain branch exists for non-string, non-number input from
    plain JS, but it built its message with JSON.stringify, which throws on
    BigInt. resolveChainId(1n) (a common shape in viem/ethers code) failed
    with 'Do not know how to serialize a BigInt' instead of the intended
    message. Circular objects failed the same way.
    Fall back to String() when JSON.stringify throws or returns undefined.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(chains): name NaN and Infinity correctly in the invalid-chainid error
    The message was built with JSON.stringify, which renders NaN and
    Infinity as null, so resolveChainId(NaN) reported 'Invalid chainid
    null', pointing at a null the caller never passed. Format numbers with
    String().
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(request): reject a JSON array response body
    The not-an-object guard used typeof data !== 'object', which arrays
    pass, so a proxy or custom transport answering [1,2] resolved as a
    successful response with no result. Reject arrays with the same
    'Unexpected response body' EtherscanError as other non-object bodies.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(request): narrow which status "0" responses count as empty results
    A status "0" response resolved as an empty success if result was any
    array (so { message: 'NOTOK', result: [] } resolved), or if the message
    matched /no.*found/ anywhere with a null or empty result.
    Both conditions are now required: the message must start with
    "No ... found" and the result must be empty (undefined, null, '' or []).
    Etherscan's real empty answers ("No transactions found", "No records
    found") still resolve.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(chains): freeze the exported CHAINS and RETIRED_CHAINS maps
    Both maps were exported as plain mutable objects, so any code in the
    process could run CHAINS.mainnet = 5 and every client's 'mainnet' would
    resolve to another network. Wrong-chain reads look like successes.
    Freeze both and type them Readonly.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * build: publish with a files allowlist instead of .npmignore
    Because .npmignore existed, npm ignored .gitignore and published every
    root file the denylist did not name. A local .env holding an Etherscan
    key would ship on npm publish; npm pack --dry-run on a copy listed it.
    The .npmignore header also referred to a MIGRATION file that does not
    exist.
    Replace it with "files": ["lib"]. npm still adds the README, LICENSE and
    package.json. A test pins the allowlist.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * docs(tutorial): use ES module imports instead of require()
    The tutorial called this a CommonJS library and used require()
    throughout, but the package's exports map only defines an import
    condition, so require('etherscan-api') fails with
    ERR_PACKAGE_PATH_NOT_EXPORTED. Show import, and a dynamic import for
    CommonJS callers.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * feat(log): add the topic0_3 and topic1_3 operators to getLogs
    Etherscan supports six topic operators, but getLogs exposed only four,
    so a filter combining topic1 with topic3, or topic0 with topic3, could
    not state its and/or operator.
    Add topic0_3_opr and topic1_3_opr as trailing arguments, after page and
    offset, so existing positional calls are unchanged.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * feat(proxy): accept call data in eth_estimateGas
    Etherscan's eth_estimateGas takes a data parameter, but the wrapper had
    no way to send it, so only plain ETH transfers could be estimated, not
    contract calls. Add an optional trailing data argument.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * feat(proxy): accept a block tag in eth_getTransactionCount
    No tag was sent, so the pending nonce (tag=pending), which is the one
    needed to build the next transaction, could not be read. Add an optional
    tag argument, sent only when given.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * feat(account): add blocktype, page and offset to getminedblocks
    Only the address was sent, so uncles could not be requested and results
    could not be paged, although Etherscan's endpoint accepts
    blocktype=blocks|uncles, page and offset.
    Add all three as optional trailing arguments, sent only when given.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * feat(account): add page and offset to txlistinternal
    txlistinternal was the only list endpoint without paging, so internal
    transactions past Etherscan's unpaged cap could not be fetched.
    Add optional page and offset after filter, which keeps existing
    positional calls unchanged. Unlike txlist they have no defaults and are
    sent only when given, so callers who never paged still get the full
    unpaged result.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * feat(transport): expose status code and headers on HTTP errors
    A non-2xx response rejected with a bare Error, so callers had to regex
    the message to tell a 429 from a 500 and could not read Retry-After.
    The default transport now rejects with EtherscanHttpError (exported),
    which carries statusCode and the response headers. The message is
    unchanged, and it still extends Error.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(init)!: require an API key instead of substituting a placeholder
    init(process.env.ETHERSCAN_KEY) with the variable unset silently used
    'YourApiKeyToken'. Etherscan V2 rejects that key, so the misconfiguration
    surfaced only later, per request, as an auth or rate-limit error that
    pointed nowhere near the missing variable.
    init() now throws when the key is missing or empty.
    BREAKING CHANGE: init() without an API key throws. Pass a real key, even
    if you only call usage.chainlist().
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(request): reject instead of throwing when a transport throws synchronously
    Promise.resolve(request(url, ...)) calls the transport before a promise
    exists, so a custom transport that threw made api.stats.ethsupply() throw
    synchronously. .then().catch() handlers never ran.
    Call the transport inside a promise executor (shared by the GET, POST and
    raw GET paths) so the throw becomes a rejection.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(transport): make the timeout a deadline for the whole request
    The default transport's timeout was a socket inactivity timeout, so a
    server writing one byte every 300 ms kept a request with timeout 1000
    open for 15.6 s. The option is documented as the request timeout.
    Replace it with a wall-clock timer that rejects and destroys the request
    once the timeout elapses, whether or not bytes are still arriving.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(request): drop undefined and null params instead of sending them as text
    serialize() ran String() over every value, so a missing argument from
    plain JS went out as the literal "undefined" (getminedblocks() sent
    address=undefined; eth_call(to, data) sent tag=undefined), and null as
    "null". Skip both so Etherscan reports the missing parameter instead
    of receiving a bogus value.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(chains): support avalanche_fuji instead of rejecting it as retired
    avalanche_fuji threw "Snowtrace moved off the Etherscan API", yet
    Etherscan's V2 chainlist serves Avalanche Fuji (43113) alongside the
    C-Chain (43114), which the library already maps. Map the name to 43113.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(chains): retire holesky and add hoodi
    Etherscan's V2 chainlist no longer includes Holesky (17000), but the
    library still mapped the name and recommended it in the goerli and
    morden retirement messages. Hoodi (560048), which Etherscan does list,
    was an unknown chain.
    holesky now throws the retired-chain error pointing at Hoodi or Sepolia,
    hoodi maps to 560048, and the Readme and examples follow.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * docs(contract): make the verification polling example work
    Etherscan answers checkverifystatus with status "0" for "Pending in
    queue" and "Fail - ...", so the call rejects with an EtherscanError.
    The example's while (status.result === 'Pending in queue') loop was
    never reached: the first poll threw.
    The example now reads the status text from err.result, the JSDoc on
    checkverifystatus and checkproxyverification says so, and a test pins
    the pending-state rejection the example relies on.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(block): take the block number as getblockreward's first argument
    Etherscan's getblockreward takes only blockno, but the wrapper required
    an address first and defaulted blockno to 0. getblockreward(2165403)
    therefore sent address=2165403&blockno=0 and resolved with the genesis
    block's reward, with no error.
    getblockreward(blockno) is now the signature. The old (address, blockno)
    form still works through a deprecated overload; the address is dropped.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
  * fix(chains): ignore inherited property names in chain lookup
    resolveChainId('constructor') returned Object and '__proto__' returned
    Object.prototype, because the name was looked up with a plain bracket
    access. Both were then sent as the chainid. Look names up with
    Object.hasOwn so they fall through to the unknown-chain error.
    Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>

2026-09-20
==========

  * 12.1.0
  * changelog
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
