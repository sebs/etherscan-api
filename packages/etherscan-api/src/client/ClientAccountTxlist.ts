import { Address } from '../entities/Address'
import { ApiKey } from '../entities/Apikey'
import { IClientAccountTxlistRequest } from '../interfaces/Account'
import { requestBuilder } from '../requestBuilder'
import { ClientPagingBase } from './ClientPagingBase'

/**
 * Client for the account balance
 */
export class ClientAccountTxlist extends ClientPagingBase implements IClientAccountTxlistRequest {
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
  action: string  = 'txlist'
  /**
   * Block to start reading data
   */
  startblock: string
  /**
   * Read data to
   */
  endblock: string
  /**
   * Sort
   */
  sort?: string

  constructor(
      apiKey: ApiKey,
      address: Address,
      startblock: string,
      endblock: string,
      sort?: string,
    ) {
    super()
    this.apiKey = apiKey
    this.address = address
    this.startblock = startblock
    this.endblock = endblock
    this.sort = sort
  }
  /**
   * Returns the serice url
   * @returns url
   */
  toUrl(): string {

    let params = {
      address: this.address.toString(),
      apiKey: this.apiKey.toString(),
      endblock: this.endblock.toString(),
      startblock: this.startblock.toString(),
    }

    if (this.sort) {
      params = Object.assign(params, {
        sort: this.sort,
      })
    }

    const pagingParams: any = this.paging.toJson()

    return requestBuilder(this.chain, this.module, this.action, Object.assign(params, pagingParams))
  }
}
