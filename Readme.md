# Etherscan API - NEXT GEN

[![npm](https://img.shields.io/npm/dt/etherscan-api.svg)](https://www.npmjs.com/package/etherscan-api)
[![license](https://img.shields.io/github/license/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api/blob/etherscan-api-monorepo/LICENSE.md)
[![GitHub tag](https://img.shields.io/github/tag/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api)
[![Travis](https://img.shields.io/travis/sebs/etherscan-api.svg)](https://travis-ci.org/sebs/etherscan-api)
[![GitHub issues](https://img.shields.io/github/issues/sebs/etherscan-api.svg)](https://github.com/sebs/etherscan-api/issues)

A way to access the [etherscan.io api](https://etherscan.io/apis) using promises. Fetch a diverse set of information about the blockchain.

See latest [changelog](./CHANGELOG.md)


Mainnet


```javascript
const client = new EtherscanClient.Client('YourApiKey');
const result = await client.account('balance')('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', 'latest')
```
