import { Address } from '../../entities/Address'
import { IClientAccountBalanceMultiRequest } from '../../interfaces/Account'
import { ClientBase } from '../ClientBase'
/**
 * Client for the account balance
 */
export class ClientAccountBalancemulti extends ClientBase implements IClientAccountBalanceMultiRequest {
  /**
   * module of the etherscan api to request
   */
  static module: string = 'account'
  /**
   * action of the etherscan api to request
   */
  static action: string = 'balancemulti'
  /**
   * Address to lookup the account balance
   */
  address: Address[]
  /**
   * tag to limit the results
   */
  tag: string

  constructor(address: Address[], tag: string) {
    super()

    if (!address.length || address.length === 0) {
      throw new Error('At least one address needs to be provided')
    }

    if (address.length >= 20) {
      throw new Error('A maximum of 20 adresses is allowed')
    }

    this.address = address
    this.tag = tag
  }

  /**
   * generates a json represenatation of the
   */
  toJson(): any {
    return {
      action: ClientAccountBalancemulti.action,
      address: this.address.map((address) => address.toString()),
      module: ClientAccountBalancemulti.module,
      tag: this.tag.toString(),
    }
  }
}
