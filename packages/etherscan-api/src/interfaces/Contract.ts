import { Address } from '../entities/Address'
/**
 * Interface for requests to contract/getabi
 */
export interface IClientContractGetabiRequest {
  /**
   * Ethereum address
   */
  address: Address
}

/**
 * Interface for requests to contract/getsourcecode
 */
export interface IClientContractGetsourcecodeRequest {
    /**
     * Ethereum address
     */
    address: Address
}
