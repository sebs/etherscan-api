# Etherscan API

## Development of a NEXTGEN Version has started - please stand by

[![npm](https://img.shields.io/npm/dt/etherscan-api.svg)](https://www.npmjs.com/package/etherscan-api)
[![license](https://img.shields.io/github/license/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api/blob/master/LICENSE.md)
[![GitHub tag](https://img.shields.io/github/tag/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api)
[![GitHub issues](https://img.shields.io/github/issues/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api/issues)

A way to access the [etherscan.io api](https://etherscan.io/apis) using promises. Fetch a diverse set of information about the blockchain.

Mainnet


```javascript
var api = require('etherscan-api').init('YourApiKey');
var balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
balance.then(function(balanceData){
  console.log(balanceData);
});
```

## Example in the wild

* [Polymer3 based example](https://github.com/hiherto-elements/test-app)


## use a own instance of axios

```js
const axios = require('axios');
const {
  init,
  pickChainUrl
} = require('..');


const chain = pickChainUrl(null);
const client = axios.create({
  baseURL: chain,
  timeout: 10000
});

var api = init('apikey', null, 10000, client);
```

## For testnet and L2s usage

Supported Chain Explorers

* [Etherscan](https://etherscan.io)
  * ropsten: 'https://api-ropsten.etherscan.io'
  * kovan: 'https://api-kovan.etherscan.io'
  * rinkeby: 'https://api-rinkeby.etherscan.io'
  * goerli: 'https://api-goerli.etherscan.io'
  * sepolia: 'https://api-sepolia.etherscan.io'
  * homestead: 'https://api.etherscan.io'
* [Arbiscan](https://arbiscan.io) (Experimental)
  * arbitrum: 'https://api.arbiscan.io'
  * arbitrum_rinkeby: 'https://api-testnet.arbiscan.io'
* [Snowtrace](https://snowtrace.io) (Experimental)
  * avalanche:'https://api.snowtrace.io',
  * avalanche_fuji: 'https://api-testnet.snowtrace.io'

Latest

```javascript
// apikey, network, timeout
var api = require('etherscan-api').init('YourApiKey','rinkeby'. '3000');
```

## Install

 ```bash
 npm install etherscan-api --save
 ```


## API Documentation

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
