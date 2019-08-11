import { ApiKey } from '../entities/Apikey'

/**
 * Interface for a basic request to the etherscan api
 */
export interface IClientRequest {
  /**
   * Module to request
   */
  module: string
  /**
   * Concrete action to request
   */
  action: string
  /**
   * apiKey to authenticate with
   */
  apiKey: ApiKey
}

/**
 * Basic Interface for an entitiy
 */
export interface IEntity {
  /**
   * Validatees a entitiy and throws on error
   */
  validate(): void
  /**
   * Checks validity
   */
  valid(): boolean
}
