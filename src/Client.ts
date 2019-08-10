import { account } from './actions/account'
import { ApiKey } from './entities/Apikey'

export class Client {
  private apiKey: ApiKey
  constructor(apiKey: string) {
    this.apiKey = new ApiKey(apiKey)
    this.apiKey.validate()
  }
  account(action: string): void {
    if (!account.get(action)) {
      throw new Error('unknown action')
    }
    return
  }
}
