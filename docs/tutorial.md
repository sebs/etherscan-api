# Tutorial

This is a Node.js library for the [Etherscan API](https://etherscan.io/apis),
shipped as an ES module (Node.js >= 20). Load it with `import`; it has no
CommonJS `require()` entry point.

## Install

```bash
npm install etherscan-api
```

## Usage

Import the library and create an API instance with your API key. With no chain
argument it defaults to Ethereum mainnet:

```js
import { init } from 'etherscan-api';

const api = init('YourApiKey');
```

To target another network, pass a chain name (or a numeric chainid) as the
second argument. One API key works across all chains:

```js
import { init } from 'etherscan-api';

const api = init('YourApiKey', 'sepolia');
```

From a CommonJS file, use a dynamic import (CommonJS has no top-level
`await`, so use `.then` or an async function):

```js
import('etherscan-api').then(({ init }) => {
  const api = init('YourApiKey');
  // ...
});
```

## Fetching a balance

Every call returns a promise:

```js
import { init } from 'etherscan-api';

const api = init('YourApiKey');

api.account
  .balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')
  .then((data) => {
    console.log(data.result);
  });
```
