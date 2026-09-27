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

/**
 * An internal transaction (`account.txlistinternal`). Looked up by `txhash`,
 * the items omit `hash` (it is the one you passed) and `traceId`.
 */
export interface InternalTransaction {
  blockNumber: string;
  timeStamp: string;
  /** Absent when looked up by `txhash`. */
  hash?: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  /** Absent when looked up by `txhash`. */
  traceId?: string;
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
  methodId: string;
  functionName: string;
  statusRep: string;
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
  methodId: string;
  functionName: string;
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
  methodId: string;
  functionName: string;
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
  CompilerType: string;
  ContractFileName: string;
  SimilarMatch: string;
}

/** Contract creation info (`contract.getcontractcreation`). */
export interface ContractCreation {
  contractAddress: string;
  contractCreator: string;
  txHash: string;
  blockNumber: string;
  timestamp: string;
  contractFactory: string;
  creationBytecode: string;
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

/** Ether supply breakdown in wei (`stats.ethsupply2`). */
export interface EthSupply2 {
  /** Ether supply excluding Eth2 staking rewards and burnt fees. */
  EthSupply: string;
  /** Eth2 staking rewards. */
  Eth2Staking: string;
  /** Burnt fees (EIP-1559). */
  BurntFees: string;
  /** Total withdrawn from the beacon chain. */
  WithdrawnTotal: string;
}

/** Number of discoverable nodes (`stats.nodecount`). */
export interface NodeCount {
  /** The day sampled, `yyyy-MM-dd`. */
  UTCDate: string;
  TotalNodeCount: string;
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

/** One day's blockchain-size sample (`stats.chainsize`). */
export interface ChainSize {
  blockNumber: string;
  chainTimeStamp: string;
  chainSize: string;
  clientType: string;
  syncMode: string;
}

/** One supported chain (`usage.chainlist`). */
export interface ChainListItem {
  chainname: string;
  chainid: string;
  blockexplorer: string;
  apiurl: string;
  /** 0 = offline, 1 = OK, 2 = degraded (see the response's `comments`). */
  status: number;
  comment: string;
}

/**
 * The `/v2/chainlist` response. Unlike `/v2/api` it has no `status`/`message`;
 * it carries a legend in `comments` and the number of chains in `totalcount`.
 */
export interface ChainListResponse {
  comments?: string;
  totalcount?: number;
  result?: ChainListItem[];
  [key: string]: unknown;
}

// The shapes below follow Etherscan's documented example responses
// (docs.etherscan.io/api-reference/endpoint/<action>), whose OpenAPI schemas
// give the same string/number types.

/**
 * API credit usage (`usage.getapilimit`). Unlike most endpoints, the credit
 * counts are JSON numbers.
 */
export interface ApiLimit {
  creditsUsed: number;
  creditsAvailable: number;
  creditLimit: number;
  /** e.g. `'daily'`. */
  limitInterval: string;
  /** Time until the interval resets, e.g. `'08:42:34'`. */
  intervalExpiryTimespan: string;
}

/** The transaction that first funded an address (`account.fundedby`). `block` is a JSON number. */
export interface FundedBy {
  block: number;
  timeStamp: string;
  fundingAddress: string;
  fundingTxn: string;
  value: string;
}

/**
 * A beacon chain withdrawal (`account.txsBeaconWithdrawal`). `amount` is in
 * gwei. Note the lowercase `timestamp`, unlike the `timeStamp` elsewhere.
 */
export interface BeaconWithdrawal {
  withdrawalIndex: string;
  validatorIndex: string;
  address: string;
  amount: string;
  blockNumber: string;
  timestamp: string;
}

/** An L2 deposit transaction (`account.getdeposittxs`; Arbitrum and OP chains). */
export interface L2Deposit {
  blockNumber: string;
  timeStamp: string;
  blockHash: string;
  hash: string;
  nonce: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  isError: string;
  errDescription: string;
  txreceipt_status: string;
  queueIndex: string;
  L1transactionhash: string;
  L1TxOrigin: string;
  tokenAddress: string;
  tokenSentFrom: string;
  tokenSentTo: string;
  tokenValue: string;
}

/** An L2 withdrawal transaction (`account.getwithdrawaltxs`; Arbitrum and OP chains). */
export interface L2Withdrawal {
  blockNumber: string;
  timeStamp: string;
  blockHash: string;
  hash: string;
  nonce: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  isError: string;
  errDescription: string;
  txreceipt_status: string;
  /** The withdrawal's state, e.g. `'Waiting'`. */
  status: string;
  L1transactionhash: string;
  tokenAddress: string;
  tokenValue: string;
}

/** A Plasma bridge deposit (`account.txnbridge`; Polygon, Gnosis and BitTorrent Chain). */
export interface PlasmaDeposit {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  address: string;
  amount: string;
  tokenName: string;
  symbol: string;
  contractAddress: string;
  divisor: string;
}
