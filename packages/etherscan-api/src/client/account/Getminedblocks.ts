import { Address } from '../../entities/Address'
import { IClientAccountGetminedblocks } from '../../interfaces/Account'
import { ClientPagingBase } from '../ClientPagingBase'

/**
 * Client for the account balance
 */
export class ClientAccountGetminedblocks extends ClientPagingBase implements IClientAccountGetminedblocks  {
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
        address: Address,
        type: string) {
      super()
      this.address = address
      this.type = type
    }

  /**
   * generates a json represenatation of the
   */
  toJson(): any {
    return {
      action: this.action,
      address: this.address.toString(),
      module: this.module,
      type: this.type.toString(),
    }
  }
}
