/**
 * Typed shapes for the `result` field of common Etherscan endpoints. Etherscan
 * returns every scalar as a JSON string, so the fields below are typed as
 * `string` (numbers, booleans and timestamps included). Endpoints whose result
 * is highly variable (the JSON-RPC proxy block/transaction objects) are left as
 * `unknown` at the call site rather than typed inaccurately here.
 */

/** One entry of an `account.balance([...])` (balancemulti) response. */
export interface MultiBalanceItem {
  account: string;
  balance: string;
}

/** A normal transaction (`account.txlist`). */
export interface NormalTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

/** An internal transaction (`account.txlistinternal`). */
export interface InternalTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  traceId: string;
  isError: string;
  errCode: string;
}

/** An ERC-20 transfer event (`account.tokentx`). */
export interface Erc20Transfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

/** An ERC-721 transfer event (`account.tokennfttx`). */
export interface Erc721Transfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

/** An ERC-1155 transfer event (`account.token1155tx`). */
export interface Erc1155Transfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  contractAddress: string;
  from: string;
  to: string;
  tokenID: string;
  tokenValue: string;
  tokenName: string;
  tokenSymbol: string;
  confirmations: string;
}

/** A block validated by an address (`account.getminedblocks`). */
export interface MinedBlock {
  blockNumber: string;
  timeStamp: string;
  blockReward: string;
}

/** An uncle entry within a {@link BlockReward}. */
export interface UncleReward {
  miner: string;
  unclePosition: string;
  blockreward: string;
}

/** Block reward detail (`block.getblockreward`). */
export interface BlockReward {
  blockNumber: string;
  timeStamp: string;
  blockMiner: string;
  blockReward: string;
  uncles: UncleReward[];
  uncleInclusionReward: string;
}

/** Estimated countdown to a future block (`block.getblockcountdown`). */
export interface BlockCountdown {
  CurrentBlock: string;
  CountdownBlock: string;
  RemainingBlock: string;
  EstimateTimeInSec: string;
}

/**
 * Per-type transaction counts within a block (`block.getblocktxnscount`).
 * Unlike most endpoints, this one returns the counts as JSON numbers rather
 * than strings.
 */
export interface BlockTransactionCount {
  block: number;
  txsCount: number;
  internalTxsCount: number;
  erc20TxsCount: number;
  erc721TxsCount: number;
  erc1155TxsCount: number;
}

/** An event log (`log.getLogs`). */
export interface EventLog {
  address: string;
  topics: string[];
  data: string;
  blockNumber: string;
  blockHash: string;
  timeStamp: string;
  gasPrice: string;
  gasUsed: string;
  logIndex: string;
  transactionHash: string;
  transactionIndex: string;
}

/** Verified-contract source metadata (`contract.getsourcecode`). */
export interface ContractSource {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  CompilerVersion: string;
  OptimizationUsed: string;
  Runs: string;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
}

/** Contract creation info (`contract.getcontractcreation`). */
export interface ContractCreation {
  contractAddress: string;
  contractCreator: string;
  txHash: string;
}

/** Contract execution status (`transaction.getstatus`). */
export interface ExecutionStatus {
  isError: string;
  errDescription: string;
}

/** Transaction receipt status (`transaction.gettxreceiptstatus`). */
export interface ReceiptStatus {
  status: string;
}

/** Ether price (`stats.ethprice`). */
export interface EthPrice {
  ethbtc: string;
  ethbtc_timestamp: string;
  ethusd: string;
  ethusd_timestamp: string;
}

/** Gas oracle (`gastracker.gasoracle`). */
export interface GasOracle {
  LastBlock: string;
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
  suggestBaseFee: string;
  gasUsedRatio: string;
}

/** One supported chain (`usage.chainlist`). */
export interface ChainListItem {
  chainname: string;
  chainid: string;
  blockexplorer: string;
  apiurl: string;
  status: number;
}
