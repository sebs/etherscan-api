import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientProxyEthEstimateGas extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_estimateGas'

    /**
     * Address of contract
     */
    to: string

    /**
     * Call to make and estimate
     */
    value: string

    constructor(to: string, value: string) {
        super()
        this.value = value
        this.to = to
    }
    /**
     * Generates json
     */
    toJson(): any {
        return {
            action: ClientProxyEthEstimateGas.action,
            module: ClientProxyEthEstimateGas.module,
            to: this.to,
            value: this.value,
        }
    }
}
