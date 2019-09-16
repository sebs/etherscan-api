import { Address } from '../../entities/Address'
import { ClientBase } from '../ClientBase'

/**
 * Client for the stats chainsize
 */
export class ClientProxyEthGetCode extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'

    /**
     * Action to call
     */
    static action: string = 'eth_getCode'

    /**
     * Address on the blockchain
     */
    address: Address

    constructor(address: Address) {
        super()
        this.address = address
    }

    /**
     * Generates a json represenation
     */
    toJson(): any {
        return {
            action: ClientProxyEthGetCode.action,
            address: this.address.toString(),
            module: ClientProxyEthGetCode.module,
        }
    }
}
