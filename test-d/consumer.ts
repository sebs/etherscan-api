// Compiled (never run) by test/types.test.js against the built lib/*.d.ts to
// pin the public types as a strict consumer sees them. Lines carrying a
// ts-expect-error directive must stay errors; every other line must compile.
// (Kept outside test/ because node --test would otherwise run this .ts file.)
import { init } from '../lib/index.js';
import type { MultiBalanceItem } from '../lib/index.js';

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

export async function tokenbalance(): Promise<void> {
  await api.account.tokenbalance('0xa', '', '0xc');

  // @ts-expect-error — the account address is required.
  await api.account.tokenbalance();
}
