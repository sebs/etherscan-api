import { Address } from '../../entities/Address'
import { Contractaddress } from '../../entities/Contractaddress'
import { Paging } from '../../entities/Paging'
import { Sort } from '../../entities/Sort'
import { IClientAccountTokentx } from '../../interfaces/Account'
import { ClientPagingBase } from '../ClientPagingBase'

/**
 * Client for the account balance
 */
export class ClientAccountTokentx extends ClientPagingBase implements IClientAccountTokentx  {
  /**
   * module of the etherscan api to request
   */
  static module: string = 'account'
  /**
   * action of the etherscan api to request
   */
  static action: string = 'tokentx'
  /**
   * Address to lookup the account balance
   */
  address: Address
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
  paging?: Paging

  constructor(
      address: Address | Contractaddress,
      startblock: string,
      endblock: string,
      sort: Sort = new Sort(),
      paging?: Paging,
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
      action: ClientAccountTokentx.action,
      address: this.address.toString(),
      endblock: this.endblock.toString(),
      module: ClientAccountTokentx.module,
      sort: this.sort.toString(),
      startblock: this.startblock.toString(),
    }

    return this.addPagingToJson(json)
  }
}
