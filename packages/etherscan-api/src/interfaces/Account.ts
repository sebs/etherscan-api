import { Address } from '../entities/Address'
import { Contractaddress } from '../entities/Contractaddress'
import { Paging } from '../entities/Paging'
import { Sort } from '../entities/Sort'
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
  paging: Paging
  /**
   * Sort Parameter
   */
  sort: Sort
}

export interface IClientAccountTxlistInternalTxhash extends IClientRequest {
  /**
   * Block to start reading data
   */
  startblock: string
  /**
   * Read data to
   */
  endblock: string
  /**
   * hash of the transaction
   */
  txhash: string
  /**
   * Paging actual page
   */
  paging: Paging
  /**
   * Sort Parameter
   */
  sort: Sort
}

export interface IClientAccountTokentx extends IClientRequest {
  /**
   * Ethereum address
   */
  address?: Address | Contractaddress
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
  paging: Paging

  /**
   * Sort Parameter
   */
  sort: Sort
}

export interface IClientAccountGetminedblocks extends IClientRequest {
  /**
   * Ethereum address
   */
  address?: Address | Contractaddress
  /**
   * Type of block (block/uncle)
   */
  type: string
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
