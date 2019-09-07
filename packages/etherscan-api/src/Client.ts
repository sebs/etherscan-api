import { account } from './actions/account'
import { ClientAccountBalance } from './client/ClientAccountBalance'
import { ClientAccountBalancemulti } from './client/ClientAccountBalancemulti'
import { Address } from './entities/Address'
import { ApiKey } from './entities/Apikey'
import { Network } from './entities/Network'
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
  protected chain: Network
  /**
   * Api key to access the etherscan api
   */
  private apiKey: ApiKey
  constructor(apiKey: string, network?: string) {
    this.apiKey = new ApiKey(apiKey)
    this.apiKey.validate()

    this.chain = network ? new Network(network) : new Network()
    this.chain.validate()
  }
  /**
   * methods to access ethereum accounts
   * @param action
   */
  account(action: string): any {
    if (!account.get(action)) {
      throw new Error('unknown action')
    }

    const actions: { [key: string]: any } = {
      balance: (address: string, tag: string): ClientAccountBalance => {
        const oAddress = new Address(address)
        const client = new ClientAccountBalance(this.apiKey, oAddress, tag)
        client.setChain(this.chain)
        return client
      },
      balancemulti(address: string[], tag: string): ClientAccountBalancemulti {
        const oAddress = address.map((addresString) => new Address(addresString))
        const client = new ClientAccountBalancemulti(this.apiKey, oAddress, tag)
        client.setChain(this.chain)
        return client
      },
    }

    return actions[action]
  }
}
