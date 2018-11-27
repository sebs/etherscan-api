2018-11-27
==========

  * deps
  * Merge pull request [#39](https://github.com/sebs/etherscan-api/issues/39) from nnqq/page-offset-parameters-txlist-method
    Page and Offset parameters to account.txlist method
  * typo fixed
  * Add Page and Offset parameters to account.txlist method
    src: https://etherscan.io/apis#accounts

2018-11-15
==========

  * 9.0.3
  * changelog
  * Package-lock .. its a thing
  * 9.0.2
  * Fuck off, who ever made package-lock.json mandatory. Really FU!
  * docs(package): Add new keyword
  * refactor(changelog): Be a bit more specific with paths
  * refactor(release): changelog generation
  * docs(account): Added a better example to account for deprecated method

2018-10-08
==========

  * 9.0.0
  * changelog
  * fix(account): Update error message when asking for a contract that is not verified by etherscan
    * BC break, major release
    * error is not 'NOTOK' anymore, ubt a conrete error message
    * still ways to improve

2018-09-29
==========

  * 8.1.5
  * changelog
  * In order to reduce the chance for test fails, I am reducing this to ONE build,
    However, in long term I need to collect responses to actual calls and do testing with mocks/stubs.
    This will come with the move to 100% es6

2018-09-24
==========

  * remove lock
  * Badges
  * 8.1.4
  * changelog
  * Move to node 9 and 10 only, update deps
  * remove autodeploy

2018-08-28
==========

  * 8.1.3
  * changelog
  * Merge pull request [#35](https://github.com/sebs/etherscan-api/issues/35) from noriega3/master
    Change testnet urls to use https
  * bundle
  * change testnet urls to use https

2018-08-16
==========

  * Merge pull request [#33](https://github.com/sebs/etherscan-api/issues/33) from dibrovadev/patch-1
    Fixed  error message from getRequest function

2018-08-15
==========

  * Fixed  error message from getRequest function

2018-06-13
==========

  * Linking demo

2018-06-12
==========

  * 8.1.2
  * changelog
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
