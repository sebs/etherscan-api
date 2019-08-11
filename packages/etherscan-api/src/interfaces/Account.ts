import { Address } from '../entities/Address'
import { IClientRequest } from './Entity'

/**
 * Interface to the Account/Balance api
 */
export interface IClientAccountBalanceRequest extends IClientRequest {
  /**
   * Ethereum address
   */
  address: Address
  /**
   * Tag to limit results
   */
  tag: string
}

/*

export interface IClientAccountBalanceMultiRequest extends IClientRequest {
  address: Address
  tag: string
}

export interface IClientAccountTxlistRequest extends IClientRequest {
  address: Address
  startblock: string
  endblock: string
  page?: string
  offset?: string
  sort?: string
}
export interface IClientAccountTxlistInternalRequest extends IClientAccountTxlistRequest {
  txhash: string
}

export interface IClientAccountTokentx extends IClientRequest {
  contractaddress: string
  startblock?: string
  endblock?: string
  page?: string
  offset?: string
  sort?: string
}
*/
