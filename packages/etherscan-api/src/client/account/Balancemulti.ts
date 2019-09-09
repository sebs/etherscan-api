import { Address } from '../../entities/Address'
import { IClientAccountBalanceMultiRequest } from '../../interfaces/Account'
import { ClientBase } from '../ClientBase'
/**
 * Client for the account balance
 */
export class ClientAccountBalancemulti extends ClientBase implements IClientAccountBalanceMultiRequest {
  /**
   * Address to lookup the account balance
   */
  address: Address[]
  /**
   * module of the etherscan api to request
   */
  module: string = 'account'
  /**
   * action of the etherscan api to request
   */
  action: string = 'balancemulti'
  /**
   * tag to limit the results
   */
  tag: string

  constructor(address: Address[], tag: string) {
    super()
    this.address = address
    this.tag = tag
  }

  /**
   * generates a json represenatation of the
   */
  toJson(): any {
    return {
      action: this.action,
      address: this.address.map((address) => address.toString()),
      module: this.module,
      tag: this.tag.toString(),
    }
  }
}
