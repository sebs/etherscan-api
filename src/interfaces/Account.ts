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

/**
 * Interface to Account/Balancemulti
 */
export interface IClientAccountBalanceMultiRequest extends IClientRequest {
  /**
   * Array of ethereum addresses
   */
  address: Address[]
  /**
   * Tag to limit results
   */
  tag: string
}

/**
 * Interface to Account/txlist and Txlistinternal
 */
export interface IClientAccountTxlistRequest extends IClientRequest {
  /**
   * Ethereum address
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
   * Paging actual page
   */
  page?: string
  /**
   * Paging start
   */
  offset?: string
  /**
   * Sort Parameter
   */
  sort?: string
}

export interface IClientAccountTxlistInternalTxhash extends IClientRequest {
  /**
   * Block to start reading data
   */
  startblock: string
  /**
   * hash of the transaction
   */
  txhash: string
  /**
   * Read data to
   */
  endblock: string
  /**
   * Paging actual page
   */
  page?: string
  /**
   * Paging start
   */
  offset?: string
  /**
   * Sort Parameter
   */
  sort?: string
}

/*
export interface IClientAccountTokentx extends IClientRequest {
  contractaddress: string
  startblock?: string
  endblock?: string
  page?: string
  offset?: string
  sort?: string
}
*/
