import { Address } from '../../entities/Address'
import { IClientStatsTokesupplyRequest } from '../../interfaces/Stats'
import { ClientBase } from '../ClientBase'

/**
 * Client for the account balance
 */
export class ClientStatsTokenupply extends ClientBase implements IClientStatsTokesupplyRequest {
  /**
   * module of the etherscan api to request
   */
  static module: string = 'stats'
  /**
   * action of the etherscan api to request
   */
  static action: string = 'tokensupply'
    /**
     * Address of the contract
     */
    contractaddress: string

    constructor(contractaddress: string) {
        super()
        this.contractaddress = contractaddress
    }
    /**
     * generates a josn representation
     */
    toJson(): any {
        return {
            action: ClientStatsTokenupply.action,
            contractaddress: this.contractaddress,
            module: ClientStatsTokenupply.module,
        }
    }
}
