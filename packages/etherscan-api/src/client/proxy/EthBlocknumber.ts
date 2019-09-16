import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientProxyEthBlocknumber extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'proxy'
    /**
     * Action to call
     */
    static action: string = 'eth_Blocknumber'
    /**
     * Generates json output
     */
    toJson(): any {
        return {
            action: ClientProxyEthBlocknumber.action,
            module: ClientProxyEthBlocknumber.module,
        }
    }
}
