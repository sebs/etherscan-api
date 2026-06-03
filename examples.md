---
title: Examples
---

# Examples

Practical, copy-pasteable snippets for the most common tasks. Every call returns
a promise resolving to an {@link EtherscanResponse} whose `result` is typed per
endpoint.

## Creating a client

```ts
import { init } from 'etherscan-api';

// Ethereum mainnet (default)
const api = init('YourApiKey');

// A testnet or L2, by name…
const sepolia = init('YourApiKey', 'sepolia');
const arbitrum = init('YourApiKey', 'arbitrum');

// …or by numeric chainid (works for any of Etherscan's 60+ chains)
const linea = init('YourApiKey', 59144);

// With a custom timeout (ms)
const slow = init('YourApiKey', 'mainnet', 30_000);
```

Retired testnets throw immediately rather than silently hitting mainnet:

```ts
init('YourApiKey', 'goerli');
// Error: Chain "goerli" is no longer supported: Goerli was deprecated;
//        use Sepolia or Holesky. ...
```

## Accounts

```ts
// Single balance — result is a string (wei)
const { result: wei } = await api.account.balance(
  '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
);

// Multiple balances — pass an array → result is { account, balance }[]
const multi = await api.account.balance([
  '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
  '0x63a9975ba31b0b9626b34300f7f627147df1f526',
]);

// Normal transactions — result is NormalTransaction[]
const txs = await api.account.txlist(
  '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
  0, 'latest', 1, 100, 'desc',
);
for (const tx of txs.result ?? []) {
  console.log(tx.hash, tx.from, '→', tx.to, tx.value);
}

// ERC-20 transfers for an address (optionally filtered by token)
const transfers = await api.account.tokentx(
  '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
  '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
);
```

## Stats, gas & prices

```ts
// Typed result: EthPrice
const price = await api.stats.ethprice();
console.log(price.result?.ethusd);

// Typed result: GasOracle
const gas = await api.gastracker.gasoracle();
console.log('propose gas (gwei):', gas.result?.ProposeGasPrice);

// Estimated confirmation time (seconds) for a given gas price (wei)
const eta = await api.gastracker.gasestimate(2_000_000_000);
```

## Proxy (JSON-RPC)

```ts
const block = await api.proxy.eth_blockNumber();   // result: hex string
const gasPrice = await api.proxy.eth_gasPrice();    // result: hex string
const receipt = await api.proxy.eth_getTransactionReceipt(
  '0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1',
);
```

## Event logs

```ts
const logs = await api.log.getLogs(
  '0x33990122638b9132ca29c723bdf037f1c891a925',
  '379224',   // fromBlock
  '400000',   // toBlock
  '0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545', // topic0
);
```

## Contracts

```ts
// ABI (JSON encoded as a string) and source for a verified contract
const abi = await api.contract.getabi('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413');
const src = await api.contract.getsourcecode('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413');
console.log(src.result?.[0]?.ContractName);

// Who created a contract, and in which tx
const creation = await api.contract.getcontractcreation(
  '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413',
);
```

### Verifying a contract (POST + poll)

```ts
const submit = await api.contract.verifysourcecode({
  contractaddress: '0xabc...',
  sourceCode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24; contract C {}',
  codeformat: 'solidity-single-file',
  contractname: 'C',
  compilerversion: 'v0.8.24+commit.e11b9ed9',
  optimizationUsed: 1,
  runs: 200,
});

const guid = submit.result; // string GUID

// Poll until done
let status = await api.contract.checkverifystatus(guid);
while (status.result === 'Pending in queue') {
  await new Promise((r) => setTimeout(r, 5000));
  status = await api.contract.checkverifystatus(guid);
}
console.log(status.result); // 'Pass - Verified' | 'Fail - Unable to verify'
```

## Error handling

Logical API failures reject with an {@link EtherscanError} (a subclass of `Error`):

```ts
import { EtherscanError } from 'etherscan-api';

try {
  await api.contract.getabi('0xNotVerified...');
} catch (err) {
  if (err instanceof EtherscanError) {
    console.error(err.message);  // e.g. "Contract source code not verified"
    console.error(err.status);   // raw API status, when present
  }
}
```

An **empty** result (e.g. an address with no transactions) is **not** an error —
Etherscan reports it as `status: "0"`, but the client resolves it with an empty
array:

```ts
const res = await api.account.txlist('0xAddressWithNoHistory...');
res.result; // [] — resolved, not thrown
```

## Custom HTTP transport

The library has no runtime dependencies — requests use Node's built-in `https`.
To use your own networking (a proxy, retries, `fetch`), pass a transport as the
4th argument. `method`/`body` are only set for the POST verification endpoints.

```ts
import { init, type Transport } from 'etherscan-api';

const request: Transport = async (url, { timeout, method = 'GET', body } = {}) => {
  const res = await fetch(url, {
    method,
    body,
    headers: body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : undefined,
    signal: AbortSignal.timeout(timeout ?? 10_000),
  });
  return res.json();
};

const api = init('YourApiKey', 'mainnet', 10_000, request);
```

## Utilities

```ts
// Live list of supported chains and their chainids (no API key needed)
const chains = await api.usage.chainlist();

// Your API key's usage and daily limit
const limit = await api.usage.getapilimit();

// Resolve a chain name to its id without creating a client
import { resolveChainId } from 'etherscan-api';
resolveChainId('base'); // 8453
```
