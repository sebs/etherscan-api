import { Paging } from '../../entities/Paging'
import { Sort } from '../../entities/Sort'
import { IClientAccountTxlistInternalTxhash } from '../../interfaces/Account'
import { ClientPagingBase } from '../ClientPagingBase'

/**
 * Client for the account balance
 */
export class ClientAccountTxlistinternalTxhash extends ClientPagingBase implements IClientAccountTxlistInternalTxhash {
  /**
   * module of the etherscan api to request
   */
  static module: string = 'account'
  /**
   * action of the etherscan api to request
   */
  static action: string = 'txlistinternal'
  /**
   * Hash of the transaction
   */
  txhash: string
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
      txhash: string,
      startblock: string,
      endblock: string,
      sort: Sort = new Sort(),
      paging?: Paging,
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
      action: ClientAccountTxlistinternalTxhash.action,
      endblock: this.endblock.toString(),
      module: ClientAccountTxlistinternalTxhash.module,
      sort: this.sort.toString(),
      startblock: this.startblock.toString(),
      txhash: this.txhash.toString(),
    }

    return this.addPagingToJson(json)
  }
}
