import { Address } from '../entities/Address'
import { ApiKey } from '../entities/Apikey'
import { IClientAccountGetminedblocks } from '../interfaces/Account'
import { requestBuilder } from '../requestBuilder'
import { ClientBase } from './ClientBase'

/**
 * Client for the account balance
 */
export class ClientAccountGetminedblocks extends ClientBase implements IClientAccountGetminedblocks  {

    /**
     * ApiKey to use the service
     */
    apiKey: ApiKey

    /**
     * module of the etherscan api to request
     */
    module: string = 'account'

    /**
     * action of the etherscan api to request
     */
    action: string = 'getminedblocks'

    /**
     * Address to lookup the account balance
     */
    address: Address

    /**
     * tag to limit the results
     */
    type: string

    constructor(
        apiKey: ApiKey,
        address: Address,
        type: string) {
      super()
      this.apiKey = apiKey
      this.address = address
      this.type = type
    }

  /**
   * Returns the serice url
   * @returns url
   */
  toUrl(): string {

    const params = {
      address: this.address.toString(),
      apiKey: this.apiKey.toString(),
      type: this.type.toString(),
    }

    return requestBuilder(this.module, this.action, params)
  }
}
