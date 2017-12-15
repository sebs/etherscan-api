2017-12-15
==========

  * Package.lock
  * Merge pull request [#15](https://github.com/sebs/etherscan-api/issues/15) from morrislaptop/patch-1
    Don't pass full URL in again as it is already set
  * Merge pull request [#16](https://github.com/sebs/etherscan-api/issues/16) from muxa/master
    Support internal transactions by address

2017-12-14
==========

  * Added support for fetching internal transactions by address, as well as specifying start/end block and sort order

2017-11-28
==========

  * Don't pass full URL in again as it is already set
    When creating the jsonClient, otherwise this confuses tools like `nock` when trying to match requests.

2017-11-22
==========

  * Merge pull request [#14](https://github.com/sebs/etherscan-api/issues/14) from vicnaum/patch-1
    getLogs fixed

2017-11-21
==========

  * getLogs fixed
    typo in "tolock" - should be "toBlock"
    no "address" field set
    module should be = 'logs', not 'log'

2017-09-17
==========

  * 3.0.11
  * changelog
  * I need new example values for the blockchain
  * 3.0.10
  * Merge pull request [#10](https://github.com/sebs/etherscan-api/issues/10) from mvayngrib/movebrowserify
    move dev deps to devDependencies
  * Merge pull request [#9](https://github.com/sebs/etherscan-api/issues/9) from mvayngrib/fixTxByHash
    fix error handling edge case
  * Merge branch 'master' into movebrowserify
  * 3.0.9
  * Removed snyk

2017-09-15
==========

  * move browserify to devDependencies

2017-09-14
==========

  * fix error handling edge case

2017-07-05
==========

  * 3.0.8
  * changelog
  * chore(deps): outdated and moving from restify to only the clients.
    * This should reduce package sizes

2017-06-29
==========

  * 3.0.7
  * changelog
  * chore(deps): Updated

2017-06-21
==========

  * 3.0.6
  * changelog
  * Added more tests for the tokenbalance

2017-06-20
==========

  * 3.0.5
  * changelog
  * Updated dev deps

2017-06-19
==========

  * 3.0.4
  * changelog
  * fix: missing data parameter.
    * Thanks for the report

2017-06-02
==========

  * 3.0.3
  * changelog
  * Update to node 8
  * Add package log

2017-05-22
==========

  * Merge pull request [#4](https://github.com/sebs/etherscan-api/issues/4) from sebs/snyk-fix-ece25e9d
    [Snyk Update] New fixes for 1 vulnerable dependency path
  * fix: package.json & .snyk to reduce vulnerabilities
    The following vulnerabilities are fixed with a Snyk patch:
    - https://snyk.io/vuln/npm:ms:20170412
    Latest report for sebs/etherscan-api:
    https://snyk.io/test/github/sebs/etherscan-api

2017-04-24
==========

  * 3.0.2
  * changelog
  * Updated Readme for dev
  * Autochangelog
  * 3.0.1

2017-04-23
==========

  * 3.0.0
  * 2.3.3
  * Improved the testnet parameter
    * testnet is no more: ropsten, rinkeby, kovan is the new testnet

2017-04-09
==========

  * changelog

2017-04-04
==========

  * 2.3.2
  * Autorelease
  * 2.3.1
  * License

2017-01-27
==========

  * bundle
  * 2.3.0
  * Churn: correct versuion number
  * Merge pull request [#3](https://github.com/sebs/etherscan-api/issues/3) from JackBekket/master
    Testnet support added

2017-01-18
==========

  * Update README.md
    noticed that npm package not upgrade with this repo
  * notice npm
  * clean
  * testnet all test passes
  * method test testnet
  * eth-test testnet passes
  * 1st testnet test pass
  * mainnet test passes
  * testing
  * minor bug fixes
  * build it
  * Readme upd
  * testnet input added

2017-01-09
==========

  * 2.2.0
  * 2.1.8
  * Updated dependencies
  * 2.1.7
  * Feature: Added a global "use strict"; for meteor

2016-10-13
==========

  * 2.1.6
  * (feature): tracking for docs
  * 2.1.5
  * (docs): examples for api docs
  * 2.1.4
  * (churn): a better keyword

2016-10-10
==========

  * (fix): bundle was not updated
  * 2.1.3
  * changelog
  * 2.1.2
  * (feature): Header and Footer
  * 2.1.1
  * i(feature): docs in sexy now
  * 2.1.0
  * (docs): the big doxing ;)
  * 2.0.4
  * (feature): proper api docs with a desc per method
  * 2.0.3
  * (churn): removed prefixes
  * 2.0.2
