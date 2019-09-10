import { Address } from '../../entities/Address'
import { IClientAccountBalanceRequest } from '../../interfaces/Account'
import { ClientBase } from '../ClientBase'

/**
 * Client for the account balance
 */
export class ClientAccountBalance extends ClientBase implements IClientAccountBalanceRequest {
  /**
   * module of the etherscan api to request
   */
  static module: string = 'account'
  /**
   * action of the etherscan api to request
   */
  static action: string = 'balance'
  /**
   * Address to lookup the account balance
   */
  address: Address
  /**
   * tag to limit the results
   */
  tag: string

  constructor(address: Address, tag: string) {
    super()
    this.address = address
    this.tag = tag
  }
  /**
   * generates a json represenatation of the
   */
  toJson(): any {
    return {
      action: ClientAccountBalance.action,
      address: this.address.toString(),
      module: ClientAccountBalance.module,
      tag: this.tag.toString(),
    }
  }
}
