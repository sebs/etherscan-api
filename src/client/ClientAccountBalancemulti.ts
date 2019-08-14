import * as request from 'request-promise-native'
import { Address } from '../entities/Address'
import { ApiKey } from '../entities/Apikey'
import { IClientAccountBalanceMultiRequest } from '../interfaces/Account'
import { requestBuilder } from '../requestBuilder'

/**
 * Client for the account balance
 */
export class ClientAccountBalancemulti implements IClientAccountBalanceMultiRequest {
  /**
   * Api key to send with the request
   */
  apiKey: ApiKey
  /**
   * Address to lookup the account balance
   */
  address: Address[]
  /**
   * module of the etherscan api to request
   */
  module: string
  /**
   * action of the etherscan api to request
   */
  action: string
  /**
   * tag to limit the results
   */
  tag: string

  constructor(apiKey: ApiKey, module: string, action: string, address: Address[], tag: string) {
    this.apiKey = apiKey
    this.module = module
    this.action = action
    this.address = address
    this.tag = tag
  }
  /**
   * Returns the serice url
   * @returns url
   */
  toUrl(): string {
    return requestBuilder(this.module, this.action, {
      address: this.address.toString(),
      apiKey: this.apiKey.toString(),
      tag: this.tag.toString(),
    })
  }
  /**
   * Dies the actual request to the server
   */
  async request(): Promise<any> {
    const options = {
      uri: this.toUrl(),
    }
    return request.get(options)
  }
}
