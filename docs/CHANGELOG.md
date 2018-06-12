2018-06-12
==========

  * Add gh pages
  * bundle

2018-06-08
==========

  * 8.1.1
  * changelog
  * Fix dependencies

2018-06-06
==========

  * 8.1.0
  * changelog
  * Merge pull request [#29](https://github.com/sebs/etherscan-api/issues/29) from mazikwyry/feature/add-tokentx-action
    Add tokentx action support to account module which allows getting a list of ERC20 tokes transfer events
  * Add tokentx action support to account module which allows getting a list of ERC20 tokes transfer events

2018-06-05
==========

  * bundle

2018-06-01
==========

  * 8.0.5
  * changelog
  * Added node 10 to test targets

2018-03-11
==========

  * Updated#
  * 8.0.4
  * changelog
  * 10 sec default timeout and added node 9 to travis

2018-03-04
==========

  * 8.0.3
  * changelog
  * Typo

2018-03-02
==========

  * Docs
  * 8.0.2
  * changelog
  * Missing docs and one parameter in getLogs
  * 8.0.1
  * optional timout parameter in ms for axios get requests
  * Splitting init to small files

2018-03-01
==========

  * 8.0.0
  * changelog
  * New error handling
  * 7.0.1
  * Add possibillity to set up livenet via 'homestead' parameter
  * 7.0.0
  * New urls for the nextworks ..
    * api- prefix
    * changed for all 3 testnets

2018-02-26
==========

  * 6.0.2
  * changelog
  * latest jsdoc
  * js
  * Fix vuln (marked via gh-pages)
  * 6.0.1
  * no pages
  * 6.0.0
  * 5.0.0
  * Foo

2018-02-16
==========

  * Merge pull request [#20](https://github.com/sebs/etherscan-api/issues/20) from m-tymchyk/master
    Change Client to Axios and fix some code style

2018-02-15
==========

  * Fixed Readme.MD

2018-02-14
==========

  * Latest Updates of Whitespaces cleaning
  * All fixes of Whitespaces

2018-02-13
==========

  * Fixed WhiteSpaces at test/testnet-balance-test.js
  * Fixed whitespaces at test/testnet-eth-test.js
  * Other fixes of WhiteSpaces
  * Some fixes
  * Fixed some whitespaces
  * Pushed for retry build
  * Fixed mainet default value
  * Up Etherscan API Version
  * Return a dist to .gitignore
  * bundle
  * Fixed tests

2018-02-12
==========

  * Added universal client Axios as HTTP client for Node.js and Browser
  * Code style and add Axios

2017-12-15
==========

  * 4.0.0
  * changelog
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
