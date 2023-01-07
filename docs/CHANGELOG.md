2023-01-07
==========

  * fix: refactoring errors and linting
  * refactor: remove bundle step
  * refactor: replace querystring with URLSearchParams
  * 10.2.2
  * changelog
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

2020-03-13
==========

  * Bump acorn from 5.7.3 to 5.7.4
    Bumps [acorn](https://github.com/acornjs/acorn) from 5.7.3 to 5.7.4.
    - [Release notes](https://github.com/acornjs/acorn/releases)
    - [Commits](https://github.com/acornjs/acorn/compare/5.7.3...5.7.4)
    Signed-off-by: dependabot[bot] <support@github.com>

2019-09-10
==========

  * 10.0.5
  * changelog

2019-09-06
==========

  * 10.0.4
  * changelog
  * Merge pull request [#54](https://github.com/sebs/etherscan-api/issues/54) from DmitryPogodaev/patch-1
    Update get-request.js
  * 10.0.3
  * Merge pull request [#47](https://github.com/sebs/etherscan-api/issues/47) from tipsysquid/patch/txlistinternal
    txlistinternal now utilizes user specified parameters

2019-09-05
==========

  * Merge pull request [#59](https://github.com/sebs/etherscan-api/issues/59) from superern/master
    Add Page, Offset for tokentx
  * additional updates
  * Fix page, offset as parameters of tokentx
  * Add package description for personal use of superern
  * change variable name to tokentx
  * add page, offset to tokentx

2019-08-22
==========

  * Merge pull request [#58](https://github.com/sebs/etherscan-api/issues/58) from kaizvn/master
    Improve issue [#42](https://github.com/sebs/etherscan-api/issues/42): showing meaning message instead of 'NOTOK'

2019-08-19
==========

  * chore : remove spacing line format.
  * Showing message if available
    - Currently if getting empty array result of transaction, will throw an error with message 'NOTOK!' only and it is really hard to debug. Base on my investigate of response format I think we can use `message = resp.data.message` as error message.

2019-08-12
==========

  * 10.0.2
  * changelog
  * bundle
  * 10.0.1
  * remove useless service
  * Updated dependencies to fix vulns

2019-08-04
==========

  * Update Readme.md

2019-06-18
==========

  * Update get-request.js
    Without this fix library returns "NOTOK" on "No transactions found" error, while requesting txlist or tokentx

2019-04-07
==========

  * txlistinternal now respects passed in parameters

2019-01-04
==========

  * remove jsdoc
  * Add documentation

2019-01-03
==========

  * Improved tests

2018-12-18
==========

  * Update tutorial.md
  * Merge pull request [#40](https://github.com/sebs/etherscan-api/issues/40) from jsdelivrbot/master
    RawGit is shutting down, replace it with jsDelivr

2018-12-08
==========

  * Replace RawGit with jsDelivr

2018-11-27
==========

  * 10.0.0
  * changelog
