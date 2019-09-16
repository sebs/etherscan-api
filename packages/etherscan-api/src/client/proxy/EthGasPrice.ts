import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientProxyEthGasPrice extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_gasPrice'
    /**
     * Generates Json output
     */
    toJson(): any {
        return {
            action: ClientProxyEthGasPrice.action,
            module: ClientProxyEthGasPrice.module,
        }
    }
}
