import * as request from 'request-promise-native'
import { Address } from '../entities/Address'
import { ApiKey } from '../entities/Apikey'
import { IClientAccountBalanceRequest } from '../interfaces/Account'
import { requestBuilder } from '../requestBuilder'
import { ClientBase } from './ClientBase'

/**
 * Client for the account balance
 */
export class ClientAccountBalance extends ClientBase implements IClientAccountBalanceRequest {
  /**
   * Api key to send with the request
   */
  apiKey: ApiKey
  /**
   * Address to lookup the account balance
   */
  address: Address
  /**
   * module of the etherscan api to request
   */
  module: string = 'account'
  /**
   * action of the etherscan api to request
   */
  action: string = 'balance'
  /**
   * tag to limit the results
   */
  tag: string

  constructor(apiKey: ApiKey, address: Address, tag: string) {
    super()
    this.apiKey = apiKey
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
}
