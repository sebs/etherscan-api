# Etherscan API

[![npm version](https://badge.fury.io/js/etherscan-api.svg)](https://badge.fury.io/js/etherscan-api) [![Build Status](https://travis-ci.org/sebs/etherscan-api.svg?branch=master)](https://travis-ci.org/sebs/etherscan-api) [![npm](https://img.shields.io/npm/dt/etherscan-api.svg?maxAge=2592000)]()

A way to access the [etherscan.io api](https://etherscan.io/apis) using promises. Fetch a diverse set of information about the blockchain


Livenet

```javascript
var api = require('etherscan-api').init('YourApiKey');
var balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
balance.then(function(balanceData){
  console.log(balanceData);
});
```

## For testnet usage

Supported:

* morden
* ropsten
* rinkeby

Latest

```javascript
var api = require('etherscan-api').init('YourApiKey','rinkeby');
```

Old Default

```javascript
var api = require('etherscan-api').init('YourApiKey','testnet');
```

## Install

 ```bash
 npm install etherscan-api --save
 ```
## Api

[Full Api Docs](https://sebs.github.io/etherscan-api/)

## Development workflow

* npm test  - runs tests
  * npm run posttest - starts the linter
* npm run lint - preconfigured linter 
* npm run docs - generates the apidocs
* npm run bundle - builds a new bundle
* npm run preversion - Steps before we create a new Tag 
  * lint 
  * changelog
* npm run pages - pushes generated apidocs to the server
* postversion - after generating a new version, push the tag to the server
* npm run changelog - generates a changelog and pushes it
