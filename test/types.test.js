import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Type-checks a strict consumer against the built lib/*.d.ts, so a regression
// in the public types fails the suite like any other test. The consumer source
// lives here rather than in a .ts file under test/, because node --test would
// run such a file as a test. It is written to a temp dir and compiled there,
// away from this repo's @types/node, so the declarations must also stand alone.
//
// Lines carrying a ts-expect-error directive must stay errors; every other line
// must compile.
const require = createRequire(import.meta.url);
const tsc = require.resolve('typescript/bin/tsc');
const lib = fileURLToPath(new URL('../lib/index.js', import.meta.url)).split(path.sep).join('/');

const CONSUMER = `
import { init } from ${JSON.stringify(lib)};
import type { MultiBalanceItem } from ${JSON.stringify(lib)};

const api = init('KEY');

export async function balances(): Promise<void> {
  // A single address resolves to a string balance…
  const single = await api.account.balance('0xa');
  const wei: string | undefined = single.result;

  // …and an array to MultiBalanceItem[].
  const multi = await api.account.balance(['0xa', '0xb']);
  const items: MultiBalanceItem[] | undefined = multi.result;
  const first: string | undefined = multi.result?.[0]?.balance;

  // A string | string[] argument still compiles, typed as the union.
  const either = await api.account.balance(Math.random() > 0.5 ? '0xa' : ['0xa']);
  const union: string | MultiBalanceItem[] | undefined = either.result;

  void wei; void items; void first; void union;
}

export async function verification(): Promise<void> {
  const base = { contractaddress: '0xa', sourceCode: 's', contractname: 'C', compilerversion: 'v0.8.24' };

  await api.contract.verifysourcecode({ ...base, optimizationUsed: 1, runs: 200, libraryname1: 'L', libraryaddress1: '0xb' });

  // @ts-expect-error — misspelt field: Etherscan would silently ignore it.
  await api.contract.verifysourcecode({ ...base, optimisationUsed: 1 });

  // @ts-expect-error — verifysourcecode needs a compilerversion.
  await api.contract.verifysourcecode({ contractaddress: '0xa', sourceCode: 's', contractname: 'C' });
}

export async function identifyingArguments(): Promise<void> {
  await api.account.txlist('0xa');
  await api.account.txlist(undefined, 0, 'latest', 1, 10, 'asc', { from: '0xa' });
  await api.stats.tokensupply(null, '0xc');

  // @ts-expect-error — txlist needs an address (or the filter form).
  await api.account.txlist();

  // @ts-expect-error — the filter form needs the filter.
  await api.account.txlist(undefined, 0, 'latest', 1, 10, 'asc');

  await api.stats.tokensupply('DGD');

  // @ts-expect-error — tokensupply needs a contract address or a token name.
  await api.stats.tokensupply();
}

export async function chainlist(): Promise<void> {
  const res = await api.usage.chainlist();
  const total: number | undefined = res.totalcount;
  const legend: string | undefined = res.comments;
  const comment: string | undefined = res.result?.[0]?.comment;
  void total; void legend; void comment;
}

export async function listOptions(): Promise<void> {
  await api.account.txlist('0xa', { page: 1, offset: 10, sort: 'desc' });
  await api.account.txlist(undefined, { filter: { from: '0xa' } });
  await api.account.tokentx('0xa', { contractaddress: '0xc', startblock: 0 });
  await api.account.txsBeaconWithdrawal('0xa', { sort: 'asc' });
  await api.account.txlistinternal({ txhash: '0xh' });
  await api.log.getLogs({ address: '0xa', topic0: '0x0', topic0_1_opr: 'and' });

  // @ts-expect-error — sort is 'asc' | 'desc'.
  await api.account.txlist('0xa', { sort: 'DESC' });

  // @ts-expect-error — the filter-only form needs a filter.
  await api.account.txlist(undefined, { page: 1 });

  // @ts-expect-error — topic operators are 'and' | 'or'.
  await api.log.getLogs({ topic0_1_opr: 'xor' });
}

export function initOptions(): void {
  init({ apiKey: 'KEY', chain: 'sepolia', timeout: 5000, maxResponseBytes: 1024, allowInsecure: false });

  // @ts-expect-error — apiKey is required in the options form.
  init({ chain: 'sepolia' });
}

export async function statsResults(): Promise<void> {
  const burnt: string | undefined = (await api.stats.ethsupply2()).result?.BurntFees;
  const nodes: string | undefined = (await api.stats.nodecount()).result?.TotalNodeCount;

  // @ts-expect-error — ethsupply2 resolves an object, not a string.
  const wrong: string | undefined = (await api.stats.ethsupply2()).result;
  void burnt; void nodes; void wrong;
}

export async function internalTransactions(): Promise<void> {
  const [tx] = (await api.account.txlistinternal({ txhash: '0xh' })).result ?? [];
  const index: string | undefined = tx?.transactionIndex;

  // @ts-expect-error — hash is absent in the txhash form, so it may be undefined.
  const hash: string = tx!.hash;
  void index; void hash;
}

export async function addedFields(): Promise<void> {
  const fn: string | undefined = (await api.account.tokentx('0xa')).result?.[0]?.functionName;
  const file: string | undefined = (await api.contract.getsourcecode('0xa')).result?.[0]?.ContractFileName;
  const factory: string | undefined = (await api.contract.getcontractcreation('0xa')).result?.[0]?.contractFactory;
  void fn; void file; void factory;
}

export async function typedResults(): Promise<void> {
  const limit: number | undefined = (await api.usage.getapilimit()).result?.creditsAvailable;
  const funder: string | undefined = (await api.account.fundedby('0xa')).result?.fundingAddress;
  const gwei: string | undefined = (await api.account.txsBeaconWithdrawal('0xa')).result?.[0]?.amount;
  const origin: string | undefined = (await api.account.getdeposittxs('0xa')).result?.[0]?.L1TxOrigin;
  const state: string | undefined = (await api.account.getwithdrawaltxs('0xa')).result?.[0]?.status;
  const symbol: string | undefined = (await api.account.txnbridge('0xa')).result?.[0]?.symbol;
  void limit; void funder; void gwei; void origin; void state; void symbol;
}

export async function tokenbalance(): Promise<void> {
  await api.account.tokenbalance('0xa', '', '0xc');

  // @ts-expect-error — the account address is required.
  await api.account.tokenbalance();
}
`;

const TSCONFIG = {
  compilerOptions: {
    target: 'ES2022',
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
    strict: true,
    noEmit: true,
    skipLibCheck: false,
    types: [],
  },
  files: ['consumer.mts'],
};

describe('public types', function () {
  let dir;

  before(function () {
    dir = mkdtempSync(path.join(tmpdir(), 'etherscan-api-types-'));
    writeFileSync(path.join(dir, 'consumer.mts'), CONSUMER);
    writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify(TSCONFIG));
  });

  after(function () {
    rmSync(dir, { recursive: true, force: true });
  });

  it('compile for a strict consumer', function () {
    try {
      execFileSync(process.execPath, [tsc, '-p', dir], { cwd: dir, encoding: 'utf8' });
    } catch (err) {
      assert.fail(err.stdout || err.message);
    }
  });
});
