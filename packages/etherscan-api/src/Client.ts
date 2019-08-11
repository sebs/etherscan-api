import { account } from './actions/account'
import { ClientAccountBalance } from './client/ClientAccountBalance'
import { Address } from './entities/Address'
import { ApiKey } from './entities/Apikey'

export class Client {
  private apiKey: ApiKey
  constructor(apiKey: string) {
    this.apiKey = new ApiKey(apiKey)
    this.apiKey.validate()
  }

  account(action: string): any {
    if (!account.get(action)) {
      throw new Error('unknown action')
    }

    var me = this;
    const actions:{ [key: string]: any } =  {
      'balance': (address: string, tag: string): ClientAccountBalance => {
        const oAddress = new Address(address)
        return new ClientAccountBalance(this.apiKey, 'account', action, oAddress, tag)
      },
    }

    return actions[action]
  }
}
