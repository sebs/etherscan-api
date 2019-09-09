import { Address } from '../../entities/Address'
import { Contractaddress } from '../../entities/Contractaddress'
import { Paging } from '../../entities/Paging'
import { Sort } from '../../entities/Sort'
import { IClientAccountTokentx } from '../../interfaces/Account'
import { ClientBase } from '../ClientBase'

/**
 * Client for the account balance
 */
export class ClientAccountTxlist extends ClientBase implements IClientAccountTokentx  {
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
  action: string = 'tokentx'
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
  sort: Sort
  /**
   * Page
   */
  paging: Paging

  constructor(
      address: Address | Contractaddress,
      startblock: string,
      endblock: string,
      paging: Paging,
      sort: Sort,
      ) {
    super()
    this.address = address
    this.startblock = startblock
    this.endblock = endblock
    this.sort = sort
    this.paging = paging
  }

  /**
   * generates a json represenatation of the
   */
  toJson(): any {
    const json = {
      address: this.address.toString(),
      endblock: this.endblock.toString(),
      sort: this.sort.toString(),
      startblock: this.startblock.toString(),
    }
    return Object.assign(json, this.paging.toJson())
  }
}
