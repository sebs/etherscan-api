import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientProxyEthGetblockByNumber extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_getBlockByNumber'

    /**
     * Tag to look up
     */
    tag: string

    /**
     * Boolean value
     */
    boolean: boolean

    constructor(tag: string, bool: boolean) {
        super()
        this.tag = tag
        this.boolean = bool
    }
    /**
     * Generates JSON representation
     */
    toJson(): any {
        return {
            action: ClientProxyEthGetblockByNumber.action,
            boolean: this.boolean.toString(),
            module: ClientProxyEthGetblockByNumber.module,
            tag: this.tag,
        }
    }
}
