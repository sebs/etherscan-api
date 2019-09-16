import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientProxyEthGetUncleByBlockNumberAndIndex extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_getUncleByBlockNumberAndIndex'

    /**
     * Tag to lookup
     */
    tag: string

    /**
     * Index
     */
    index: string

    constructor(index: string, tag: string) {
        super()
        this.tag = tag
        this.index = index
    }

    /**
     * Generates Json representation
     */
    toJson(): any {
        return {
            action: ClientProxyEthGetUncleByBlockNumberAndIndex.action,
            index: this.index,
            module: ClientProxyEthGetUncleByBlockNumberAndIndex.module,
            tag: this.tag,
        }
    }
}
