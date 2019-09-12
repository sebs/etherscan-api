import { PositiveNumber } from '../entities/PositiveNumber'

/**
 * Interface to the Account/Balance api
 */
export interface IClientBlockGetblockrewardRequest  {
  /**
   * Blocknumber
   */
  blockno: PositiveNumber
}
