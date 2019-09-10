import { account } from './actions/account'
import { ClientAccountBalance } from './client/account/Balance'
import { ClientAccountBalancemulti } from './client/account/Balancemulti'
import { Address } from './entities/Address'
import { ApiKey } from './entities/Apikey'
import { Network } from './entities/Network'
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
   * methods to access ethereum accounts
   * @param action
   */
  account(action: string): any {
    if (!account.get(action)) {
      throw new Error('unknown action')
    }

    const actions: { [key: string]: any } = {
      balance: (address: string, tag: string): Promise<any> => {
        const oAddress = new Address(address)
        const client = new ClientAccountBalance(oAddress, tag)
        const json = client.toJson()
        json.apiKey = this.apiKey.toString()
        return performRequest(
          this.network,
          ClientAccountBalance.module,
          ClientAccountBalance.action,
          json,
        ).then((response) => response.json())
      },
      balancemulti(address: string[], tag: string): ClientAccountBalancemulti {
        const oAddress = address.map((addresString) => new Address(addresString))
        const client = new ClientAccountBalancemulti(oAddress, tag)
        client.setNetwork(this.chain)
        return client
      },
    }

    return actions[action]
  }
}
