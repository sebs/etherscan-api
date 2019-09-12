import { account } from './actions/account'
import { block } from './actions/block'
import { contract } from './actions/contract'
import { transaction } from './actions/transaction'
import { ClientAccountBalance } from './client/account/Balance'
import { ClientAccountBalancemulti } from './client/account/Balancemulti'
import { ClientAccountGetminedblocks } from './client/account/Getminedblocks'
import { ClientAccountTokentx } from './client/account/Tokentx'
import { ClientAccountTxlist } from './client/account/Txlist'
import { ClientAccountTxlistinternal } from './client/account/Txlistinternal'
import { ClientAccountTxlistinternalTxhash } from './client/account/TxlistinternalTxhash'
import { ClientBlockGetblockreward } from './client/block/Getblockreward'
import { ClientContractGetabi } from './client/contract/Getabi'
import { ClientContractGetsource } from './client/contract/Getsource'
import { ClientTransactionGetstatus } from './client/transaction/Getstatus'
import { ClientTransactionGettxreceiptstatus } from './client/transaction/Gettxreceiptstatus'
import { Address } from './entities/Address'
import { ApiKey } from './entities/Apikey'
import { Network } from './entities/Network'
import { PositiveNumber } from './entities/PositiveNumber'
import { Sort } from './entities/Sort'
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
