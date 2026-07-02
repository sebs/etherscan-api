import { init } from './init.js';
import { resolveChainId } from './chains.js';

/**
 * Removed in v11. The Etherscan V2 API uses a single base URL and selects the
 * network with a `chainid` parameter, so there is no longer a per-chain URL to
 * pick. Pass a chain name or numeric chainid to {@link init}, or call
 * {@link resolveChainId} if you need the id directly.
 *
 * @throws {Error} Always — this export only exists to point upgraders at the replacement.
 */
export function pickChainUrl(): never {
  throw new Error(
    'pickChainUrl was removed in v11: Etherscan V2 uses one base URL with a ' +
      'chainid parameter. Pass a chain name or numeric chainid to init(apiKey, chain), ' +
      'or use resolveChainId(chain).',
  );
}

export { init, resolveChainId };
export { EtherscanError } from './errors.js';
export type { EtherscanErrorDetails } from './errors.js';
export type { EtherscanApi } from './init.js';
export type { AdvancedFilter } from './account.js';
export type { VerifyParams, VerifySourceCodeParams } from './contract.js';
export type { Transport, TransportOptions, EtherscanResponse } from './types.js';
export type {
  MultiBalanceItem,
  NormalTransaction,
  InternalTransaction,
  Erc20Transfer,
  Erc721Transfer,
  Erc1155Transfer,
  MinedBlock,
  UncleReward,
  BlockReward,
  BlockCountdown,
  BlockTransactionCount,
  EventLog,
  ContractSource,
  ContractCreation,
  ExecutionStatus,
  ReceiptStatus,
  EthPrice,
  GasOracle,
  ChainSize,
  ChainListItem,
} from './results.js';
export { CHAINS, RETIRED_CHAINS } from './chains.js';
