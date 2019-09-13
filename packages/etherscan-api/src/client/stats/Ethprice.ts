import { ClientBase } from '../ClientBase'

/**
 * Client for the account balance
 */
export class ClientStatsEthprice extends ClientBase {
    /**
     * module of the etherscan api to request
     */
    static module: string = 'stats'
    /**
     * action of the etherscan api to request
     */
    static action: string = 'ethprice'

    constructor() {
        super()
    }
    /**
     * generates a josn representation
     */
    toJson(): any {
        return {
            action: ClientStatsEthprice.action,
            module: ClientStatsEthprice.module,
        }
    }
}
