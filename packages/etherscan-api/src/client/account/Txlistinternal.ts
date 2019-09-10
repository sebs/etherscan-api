import { Address } from '../../entities/Address'
import { ApiKey } from '../../entities/Apikey'
import { Paging } from '../../entities/Paging'
import { Sort } from '../../entities/Sort'
import { IClientAccountTxlistRequest } from '../../interfaces/Account'
import { ClientPagingBase } from '../ClientPagingBase'

/**
 * Client for the account balance
 */
export class ClientAccountTxlistinternal extends ClientPagingBase implements IClientAccountTxlistRequest {
  /**
   * module of the etherscan api to request
   */
  static module: string = 'account'
  /**
   * action of the etherscan api to request
   */
  static action: string = 'txlistinternal'
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
      address: Address,
      startblock: string,
      endblock: string,
      sort: Sort = new Sort(),
      paging?: Paging,
    ) {
    super()
    this.address = address
    this.startblock = startblock
    this.endblock = endblock
    this.paging = paging
    this.sort = sort
  }
  /**
   * Generates a JSON representation
   */
  toJson(): any {
    const json = {
      action: ClientAccountTxlistinternal.action,
      address: this.address.toString(),
      endblock: this.endblock.toString(),
      module: ClientAccountTxlistinternal.module,
      sort: this.sort.toString(),
      startblock: this.startblock.toString(),
    }
    return this.addPagingToJson(json)
  }
}
