import { Address } from '../entities/Address'
import { ApiKey } from '../entities/Apikey'
import { IClientAccountBalanceRequest } from '../interfaces/Account'

import { requestBuilder } from '../requestBuilder'

export class ClientAccountBalance implements IClientAccountBalanceRequest {
  apiKey: ApiKey
  address: Address
  module: string
  action: string
  tag: string

  constructor(apiKey: ApiKey, module: string, action: string, address: Address, tag: string) {
    this.apiKey = apiKey
    this.module = module
    this.action = action
    this.address = address
    this.tag = tag
  }

  toUrl(): string {
    return requestBuilder(this.module, this.action, {
      address: this.address.toString(),
      tag: this.tag.toString(), 
      apiKey: this.apiKey.toString()
    })
  }

}
