import * as request from 'request-promise-native'
import { Address } from '../entities/Address'
import { ApiKey } from '../entities/Apikey'
import { Contractaddress } from '../entities/Contractaddress'
import { IClientAccountGetminedblocks } from '../interfaces/Account'
import { requestBuilder } from '../requestBuilder'
import { ClientBase } from './ClientBase'

/**
 * Client for the account balance
 */
export class ClientGetminedblocks extends ClientBase implements IClientAccountGetminedblocks  {

    /**
     * ApiKey to use the service
     */
    apiKey: ApiKey

    /**
     * module of the etherscan api to request
     */
    module: string

    /**
     * action of the etherscan api to request
     */
    action: string

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
        module: string,
        action: string,
        address: Address,
        type: string) {
      super()
      this.apiKey = apiKey
      this.address = address
      this.module = module
      this.action = action
      this.type = type
    }
}
