import { account } from './actions/account'
import { ClientAccountBalance } from './client/ClientAccountBalance'
import { ClientAccountBalancemulti } from './client/ClientAccountBalancemulti'
import { Address } from './entities/Address'
import { ApiKey } from './entities/Apikey'

/**
 * Client for the api at etherscan.io
 */
export class Client {
  /**
   * Api key to access the etherscan api
   */
  private apiKey: ApiKey
  constructor(apiKey: string) {
    this.apiKey = new ApiKey(apiKey)
    this.apiKey.validate()
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
        return new ClientAccountBalance(this.apiKey, 'account', action, oAddress, tag)
      },
      balancemulti(address: string[], tag: string): ClientAccountBalancemulti {
        const oAddress = address.map((addresString) => new Address(addresString))
        return new ClientAccountBalancemulti(this.apiKey, 'account', action, oAddress, tag)
      },
    }

    return actions[action]
  }
}
