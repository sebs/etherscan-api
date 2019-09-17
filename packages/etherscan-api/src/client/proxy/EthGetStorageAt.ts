import { Address } from '../../entities/Address'
import { ClientBase } from '../ClientBase'

/**
 * Client for the stats chainsize
 */
export class ClientProxyEthGetStorageAt extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_getStorageAt'
    /**
     * Address to request
     */
    address: Address
    /**
     * Tag to show
     */
    tag: string

    /**
     * position
     */
    position: string

    constructor(address: Address, position: string, tag: string) {
        super()
        this.address = address
        this.position = position
        this.tag = tag
    }
    /**
     * Generates a json representation
     */
    toJson(): any {
        return {
            action: ClientProxyEthGetStorageAt.action,
            address: this.address.toString(),
            module: ClientProxyEthGetStorageAt.module,
            postion: this.position,
            tag: this.tag,
        }
    }
}
