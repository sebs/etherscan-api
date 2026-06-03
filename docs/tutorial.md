# Tutorial

This is a Node.js / CommonJS library for the [Etherscan API](https://etherscan.io/apis).

## Install

```bash
npm install etherscan-api
```

## Usage

Require the library and create an API instance with your API key. With no chain
argument it defaults to Ethereum mainnet:

```js
const { init } = require('etherscan-api');

const api = init('YourApiKey');
```

To target another network, pass a chain name (or a numeric chainid) as the
second argument. One API key works across all chains:

```js
const { init } = require('etherscan-api');

const api = init('YourApiKey', 'sepolia');
```

## Fetching a balance

Every call returns a promise:

```js
const { init } = require('etherscan-api');

const api = init('YourApiKey');

api.account
  .balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')
  .then((data) => {
    console.log(data.result);
  });
```
