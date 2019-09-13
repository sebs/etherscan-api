import { ClientBase } from '../ClientBase'

/**
 * Client for the account balance
 */
export class ClientStatsEthsupply extends ClientBase {
    /**
     * module of the etherscan api to request
     */
    static module: string = 'stats'
    /**
     * action of the etherscan api to request
     */
    static action: string = 'ethsupply'

    constructor() {
        super()
    }
    /**
     * generates a josn representation
     */
    toJson(): any {
        return {
            action: ClientStatsEthsupply.action,
            module: ClientStatsEthsupply.module,
        }
    }
}
