import { Address } from '../../entities/Address'
import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientProxyEthGetTransactionCount extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_getTransactionCount'
    /**
     * Address of the transaction
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
     * Generates json representation
     */
    toJson(): any {
        return {
            action: ClientProxyEthGetTransactionCount.action,
            address: this.address.toString(),
            module: ClientProxyEthGetTransactionCount.module,
            tag: this.tag,
        }
    }
}
