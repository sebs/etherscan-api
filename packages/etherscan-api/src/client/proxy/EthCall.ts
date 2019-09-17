import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientProxyEthCall extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_call'

    /**
     * data of the call
     */
    data: string

    /**
     * Tag of the call address
     */
    tag: string
    /**
     * Call destination and code
     */
    to: string

    constructor(to: string, data: string, tag: string) {
        super()
        this.to = to
        this.data = data
        this.tag = tag
    }
    /**
     * Generates Json output
     */
    toJson(): any {
        return {
            action: ClientProxyEthCall.action,
            data: this.data,
            module: ClientProxyEthCall.module,
            tag: this.tag,
            to: this.to,
        }
    }
}
