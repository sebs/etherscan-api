import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientProxyEthGetTransactionByHash extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_getTransactionByHash'

    /**
     * Txhash of the transaction
     */
    txhash: string

    constructor(txhash: string) {
        super()
        this.txhash = txhash
    }
    /**
     * Generates a json representation
     */
    toJson(): any {
        return {
            action: ClientProxyEthGetTransactionByHash.action,
            module: ClientProxyEthGetTransactionByHash.module,
            txhash: this.txhash,
        }
    }
}
