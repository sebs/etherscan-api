import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientProxyEthGetBlockTransactionCountByNumber extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_getBlockTransactionCountByNumber'
    /**
     * Tag to lookup
     */
    tag: string

    constructor(tag: string) {
        super()
        this.tag = tag
    }
    /**
     * Generates json representation
     */
    toJson(): any {
        return {
            action: ClientProxyEthGetBlockTransactionCountByNumber.action,
            module: ClientProxyEthGetBlockTransactionCountByNumber.module,
            tag: this.tag,
        }
    }
}
