import { Paging } from '../../entities/Paging'
import { Sort } from '../../entities/Sort'
import { IClientAccountTxlistInternalTxhash } from '../../interfaces/Account'
import { ClientPagingBase } from '../ClientPagingBase'

/**
 * Client for the account balance
 */
export class ClientAccountTxlistinternalTxhash extends ClientPagingBase implements IClientAccountTxlistInternalTxhash {
  /**
   * Hash of the transaction
   */
  txhash: string
  /**
   * module of the etherscan api to request
   */
  module: string = 'account'
  /**
   * action of the etherscan api to request
   */
  action: string = 'txlistinternal'
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
      txhash: string,
      startblock: string,
      endblock: string,
      paging: Paging = new Paging(),
      sort: Sort = new Sort(),
      ) {
    super()
    this.txhash = txhash
    this.startblock = startblock
    this.endblock = endblock
    this.sort = sort
    this.paging = paging
  }
  /**
   * Generates a JSON representation
   */
  toJson(): any {
    const json = {
      action: this.action,
      endblock: this.endblock.toString(),
      module: this.module,
      sort: this.sort.toString(),
      startblock: this.startblock.toString(),
      txhash: this.txhash.toString(),
    }
    return Object.assign(json, this.paging.toJson())
  }
}
