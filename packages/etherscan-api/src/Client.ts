import { account } from './actions/account'
import { block } from './actions/block'
import { contract } from './actions/contract'
import { logs } from './actions/logs'
import { proxy } from './actions/proxy'
import { stats } from './actions/stats'
import { transaction } from './actions/transaction'
import { ClientAccountBalance } from './client/account/Balance'
import { ClientAccountBalancemulti } from './client/account/Balancemulti'
import { ClientAccountGetminedblocks } from './client/account/Getminedblocks'
import { ClientAccountTokenbalance } from './client/account/Tokenbalance'
import { ClientAccountTokentx } from './client/account/Tokentx'
import { ClientAccountTxlist } from './client/account/Txlist'
import { ClientAccountTxlistinternal } from './client/account/Txlistinternal'
import { ClientAccountTxlistinternalTxhash } from './client/account/TxlistinternalTxhash'
import { ClientBlockGetblockreward } from './client/block/Getblockreward'
import { ClientContractGetabi } from './client/contract/Getabi'
import { ClientContractGetsource } from './client/contract/Getsource'
import { ClientProxyEthBlocknumber } from './client/proxy/EthBlocknumber'
import { ClientProxyEthCall } from './client/proxy/EthCall'
import { ClientProxyEthEstimateGas } from './client/proxy/EthEstimateGas'
import { ClientProxyEthGasPrice } from './client/proxy/EthGasPrice'
import { ClientProxyEthGetblockByNumber } from './client/proxy/EthGetblockByNumber'
import { ClientProxyEthGetBlockTransactionCountByNumber} from './client/proxy/EthGetBlockTransactionCountByNumber'
import { ClientProxyEthGetCode } from './client/proxy/EthGetCode'
import { ClientProxyEthGetStorageAt } from './client/proxy/EthGetStorageAt'
import { ClientProxyEthGetTransactionByBlockNumberAndIndex } from './client/proxy/EthGetTransactionByBlockNumberAndIndex'
import { ClientProxyEthGetTransactionCount } from './client/proxy/EthGetTransactionCount'
import { ClientProxyEthGetTransactionByHash } from './client/proxy/EthGetTxByHash'
import { ClientProxyEthGetUncleByBlockNumberAndIndex } from './client/proxy/EthGetUncleByBlockNumberAndIndex'
import { ClientStatsChainsize } from './client/stats/Chainsize'
import { ClientStatsEthprice } from './client/stats/Ethprice'
import { ClientStatsEthsupply } from './client/stats/Ethsupply'
import { ClientStatsTokenupply } from './client/stats/Tokensupply'
import { ClientTransactionGetstatus } from './client/transaction/Getstatus'
import { ClientTransactionGettxreceiptstatus } from './client/transaction/Gettxreceiptstatus'
import { Address } from './entities/Address'
import { ApiKey } from './entities/Apikey'
import { Clienttype } from './entities/Clienttype'
import { Network } from './entities/Network'
import { PositiveNumber } from './entities/PositiveNumber'
import { Sort } from './entities/Sort'
import { Syncmode } from './entities/Syncmode'
import { UsDate } from './entities/UsDate'
import { performRequest } from './util/performRequest'
import { VERSION } from './version'

/**
 * Client for the api at etherscan.io
 */
export class Client {
  /**
   * Version number of the client
   */
  static version: string = VERSION
  /**
   * Network
   */
  protected network: Network
  /**
   * Api key to access the etherscan api
   */
  private apiKey: ApiKey
  constructor(apiKey: string, network?: string) {
    this.apiKey = new ApiKey(apiKey)
    this.apiKey.validate()

    this.network = network ? new Network(network) : new Network()
    this.network.validate()
  }
  /**
   * Proxy to web3
   * @param action
   */
  proxy(action: string) {
    const apiKey = this.apiKey
    const network = this.network
    if (!proxy.get(action)) {
      throw new Error('unknown action' + action)
    }
    const actions: { [key: string]: any } = {
      eth_call(to: string, data: string, tag: string) {
        const client = new ClientProxyEthCall(to, data, tag)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthCall.module,
          ClientProxyEthCall.action,
          json,
        ).then((response) => response.json())
      },
      eth_Blocknumber() {
        const client = new ClientProxyEthBlocknumber()
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthBlocknumber.module,
          ClientProxyEthBlocknumber.action,
          json,
        ).then((response) => response.json())
      },
      eth_estimateGas(value: string, to: string, gasPrice: string) {
        const client = new ClientProxyEthEstimateGas(to, value, gasPrice)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthEstimateGas.module,
          ClientProxyEthEstimateGas.action,
          json,
        ).then((response) => response.json())
      },
      eth_gasPrice() {
        const client = new ClientProxyEthGasPrice()
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthGasPrice.module,
          ClientProxyEthGasPrice.action,
          json,
        ).then((response) => response.json())
      },
      eth_getBlockTransactionCountByNumber(tag: string) {
        const client = new ClientProxyEthGetBlockTransactionCountByNumber(tag)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthGetBlockTransactionCountByNumber.module,
          ClientProxyEthGetBlockTransactionCountByNumber.action,
          json,
        ).then((response) => response.json())
      },
      eth_getCode(address: string, tag: string) {
        const client = new ClientProxyEthGetCode(new Address(address), tag)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthGetCode.module,
          ClientProxyEthGetCode.action,
          json,
        ).then((response) => response.json())
      },
      eth_getStorageAt(address: string, position: string, tag: string) {
        const client = new ClientProxyEthGetStorageAt(new Address(address), position, tag)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthGetStorageAt.module,
          ClientProxyEthGetStorageAt.action,
          json,
        ).then((response) => response.json())
      },
      eth_getTransactionByBlockNumberAndIndex(index: string, tag: string) {
        const client = new ClientProxyEthGetTransactionByBlockNumberAndIndex(index, tag)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthGetTransactionByBlockNumberAndIndex.module,
          ClientProxyEthGetTransactionByBlockNumberAndIndex.action,
          json,
        ).then((response) => response.json())
      },
      eth_getTransactionCount(address: string, tag: string) {
        const client = new ClientProxyEthGetTransactionCount(new Address(address), tag)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthGetTransactionCount.module,
          ClientProxyEthGetTransactionCount.action,
          json,
        ).then((response) => response.json())
      },
      eth_getTransactionByHash(txhash: string) {
        const client = new ClientProxyEthGetTransactionByHash(txhash)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthGetTransactionByHash.module,
          ClientProxyEthGetTransactionByHash.action,
          json,
        ).then((response) => response.json())
      },
      eth_getUncleByBlockNumberAndIndex(index: string, tag: string) {
        const client = new ClientProxyEthGetUncleByBlockNumberAndIndex(index, tag)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientProxyEthGetUncleByBlockNumberAndIndex.module,
          ClientProxyEthGetUncleByBlockNumberAndIndex.action,
          json,
        ).then((response) => response.json())
      },
      eth_getBlockByNumber(tag: string, bool: boolean) {
        const client = new ClientProxyEthGetblockByNumber(tag, bool)
      },
    }
    return actions[action]
  }
  /**
   * Access log Information
   * @param action
   */
  log(action: string): any {
    const apiKey = this.apiKey
    const network = this.network
    if (!logs.get(action)) {
      throw new Error('unknown action' + action)
    }
    const actions: { [key: string]: any } = {
      getLogs(
        fromBlock: string,
        toBlock: string,
        address: string,
        topics: string[],
        topic01opr?: string,
        topic12opr?: string,
        topic23opr?: string,
        topic02opr?: string,
        topic03opr?: string,
        topic13opr?: string,
      ) {
        const oFromBlock = new PositiveNumber(fromBlock)
        const oToBlock = new PositiveNumber(toBlock)
        // const oToBlock = !!fromBlock ? new PositiveNumber(fromBlock) : undefined
      },
    }
  }
  /**
   * Statistics methods
   * @param action
   */
  stats(action: string): any {
    const apiKey = this.apiKey
    const network = this.network
    if (!stats.get(action)) {
      throw new Error('unknown action' + action)
    }
    const actions: { [key: string]: any } = {
      ethprice() {
        const client = new ClientStatsEthprice()
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientStatsTokenupply.module,
          ClientStatsTokenupply.action,
          json,
        ).then((response) => response.json())
      },
      ethsupply() {
        const client = new ClientStatsEthsupply()
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientStatsTokenupply.module,
          ClientStatsTokenupply.action,
          json,
        ).then((response) => response.json())
      },
      chainsize(startdate: string, enddate: string, clienttype: string, syncmode: string) {
        const oStartdate = new UsDate(startdate)
        const oEnddate = new UsDate(enddate)
        const oClienttype = new Clienttype(clienttype)
        const oSyncmode = new Syncmode(syncmode)
        const client = new ClientStatsChainsize(oStartdate, oEnddate, oClienttype, oSyncmode)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientStatsTokenupply.module,
          ClientStatsTokenupply.action,
          json,
        ).then((response) => response.json())
      },
      tokensupply(contractaddress: string) {
        const client = new ClientStatsTokenupply(contractaddress)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientStatsTokenupply.module,
          ClientStatsTokenupply.action,
          json,
        ).then((response) => response.json())
      },
    }
    return actions[action]
  }

  /**
   * Block api
   * @param action
   */
  block(action: string): any {
    const apiKey = this.apiKey
    const network = this.network
    if (!block.get(action)) {
      throw new Error('unknown action' + action)
    }
    const actions: { [key: string]: any } = {
      getblockreward(blockno: string) {
        const blocknoNumber = new PositiveNumber(blockno)
        const client = new ClientBlockGetblockreward(blocknoNumber)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientBlockGetblockreward.module,
          ClientBlockGetblockreward.action,
          json,
        ).then((response) => response.json())
      },
    }
    return actions[action]
  }
  /**
   * Transaction api
   * @param action
   */
  transaction(action: string): any {
    const apiKey = this.apiKey
    const network = this.network
    if (!transaction.get(action)) {
      throw new Error('unknown action' + action)
    }
    const actions: { [key: string]: any } = {
      getstatus(txhash: string) {
        const client = new ClientTransactionGetstatus(txhash)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientContractGetabi.module,
          ClientContractGetabi.action,
          json,
        ).then((response) => response.json())
      },
      gettxreceiptstatus(txhash: string) {
        const client = new ClientTransactionGettxreceiptstatus(txhash)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientContractGetabi.module,
          ClientContractGetabi.action,
          json,
        ).then((response) => response.json())
      },
    }
    return actions[action]
  }

  /**
   * methods to access ethereum contract data
   * @param action
   */
  contract(action: string): any {
    const apiKey = this.apiKey
    const network = this.network

    if (!contract.get(action)) {
      throw new Error('unknown action' + action)
    }
    const actions: { [key: string]: any } = {
      getabi(address: string) {
        const oAddress = new Address(address)
        const client = new ClientContractGetabi(oAddress)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientContractGetabi.module,
          ClientContractGetabi.action,
          json,
        ).then((response) => response.json())
      },
      getsourcecode(address: string) {
        const oAddress = new Address(address)
        const client = new ClientContractGetsource(oAddress)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientContractGetsource.module,
          ClientContractGetsource.action,
          json,
        ).then((response) => response.json())
      },
    }
    return actions[action]
  }

  /**
   * methods to access ethereum accounts
   * @param action
   */
  account(action: string): any {

    const validatingAction = action === 'txlistinternaltxhash' ? 'txlistinternal' : action
    const apiKey = this.apiKey
    const network = this.network

    if (!account.get(validatingAction)) {
      throw new Error('unknown action' + validatingAction)
    }

    const actions: { [key: string]: any } = {
      balance: (address: string, tag: string): Promise<any> => {
        const oAddress = new Address(address)
        const client = new ClientAccountBalance(oAddress, tag)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientAccountBalance.module,
          ClientAccountBalance.action,
          json,
        ).then((response) => response.json())
      },
      balancemulti(address: string[], tag: string): Promise<any> {
        const oAddress = address.map((addresString) => new Address(addresString))
        const client = new ClientAccountBalancemulti(oAddress, tag)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientAccountBalancemulti.module,
          ClientAccountBalancemulti.action,
          json,
        ).then((response) => response.json())
      },
      getminedblocks(address: string, type: string): Promise<any> {
        const oAddress = new Address(address)
        const client = new ClientAccountGetminedblocks(oAddress, type)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientAccountGetminedblocks.module,
          ClientAccountGetminedblocks.action,
          json,
        ).then((response) => response.json())
      },
      tokenbalance(address: string, contractaddress: string): Promise<any> {
        const client = new ClientAccountTokenbalance(
          new Address(address),
          new Address(contractaddress),
        )
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientAccountTokenbalance.module,
          ClientAccountTokenbalance.action,
          json,
        ).then((response) => response.json())
      },
      tokentx(address: string, startblock: string, endblock: string, sort?: string): Promise<any> {
        const oAddress = new Address(address)
        const oSort = !!sort ? new Sort(sort) : undefined
        const client = new ClientAccountTokentx(oAddress, startblock, endblock, oSort)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientAccountTokentx.module,
          ClientAccountTokentx.action,
          json,
        ).then((response) => response.json())
      },
      txlist(address: string, startblock: string, endblock: string, sort?: string): Promise<any> {
        const oAddress = new Address(address)
        const oSort = !!sort ? new Sort(sort) : undefined
        const client = new ClientAccountTxlist(oAddress, startblock, endblock, oSort)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientAccountTokentx.module,
          ClientAccountTokentx.action,
          json,
        ).then((response) => response.json())
      },
      txlistinternal(address: string, startblock: string, endblock: string, sort?: string): Promise<any> {
        const oAddress = new Address(address)
        const oSort = !!sort ? new Sort(sort) : undefined
        const client = new ClientAccountTxlistinternal(oAddress, startblock, endblock, oSort)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientAccountTokentx.module,
          ClientAccountTokentx.action,
          json,
        ).then((response) => response.json())
      },
      txlistinternaltxhash(txhash: string, startblock: string, endblock: string, sort?: string): Promise<any> {
        const oSort = !!sort ? new Sort(sort) : undefined
        const client = new ClientAccountTxlistinternalTxhash(txhash, startblock, endblock, oSort)
        const json = client.toJson()
        json.apiKey = apiKey.toString()
        return performRequest(
          network,
          ClientAccountTokentx.module,
          ClientAccountTokentx.action,
          json,
        ).then((response) => response.json())
      },
    }
    return actions[action]
  }
}
