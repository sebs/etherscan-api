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

    /**
     * tag
     */
    tag: string

    constructor(address: Address, tag: string) {
        super()
        this.address = address
        this.tag = tag
    }

    /**
     * Generates a json represenation
     */
    toJson(): any {
        return {
            action: ClientProxyEthGetCode.action,
            address: this.address.toString(),
            module: ClientProxyEthGetCode.module,
            tag: this.tag,
        }
    }
}
