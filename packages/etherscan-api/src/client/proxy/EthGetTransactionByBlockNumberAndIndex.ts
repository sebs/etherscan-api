import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientProxyEthGetTransactionByBlockNumberAndIndex extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_getTransactionByBlockNumberAndIndex'

    /**
     * Index
     */
    index: string

    /**
     * Tag
     */
    tag: string

    constructor(index: string, tag: string) {
        super()
        this.index = index
        this.tag = tag
    }
    /**
     * Generates json representation
     */
    toJson(): any {
        return {
            action: ClientProxyEthGetTransactionByBlockNumberAndIndex.action,
            index: this.index,
            module: ClientProxyEthGetTransactionByBlockNumberAndIndex.module,
            tag: this.tag,
        }
    }
}
