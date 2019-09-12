import { Clienttype } from '../entities/Clienttype'
import { Syncmode } from '../entities/Syncmode'
import { UsDate } from '../entities/UsDate'

/**
 * Interface to the Stats/Tokensupply api
 */
export interface IClientStatsTokensupplyRequest  {
  /**
   * Contract address
   */
  contractaddress: string
}

export interface IClientStatsChainsizeRequest {

  /**
   * Chain startdate
   */
  startdate: UsDate

  /**
   * Chain enddate
   */
  enddate: UsDate

  /**
   * Type of client producing the stats
   */
  clienttype: Clienttype

  /**
   * Syncmode
   */
  syncmode: Syncmode
}
