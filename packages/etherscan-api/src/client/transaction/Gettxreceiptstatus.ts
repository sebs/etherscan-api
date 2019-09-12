import { Address } from '../../entities/Address'
import { IClientTransactionGetstatusRequest } from '../../interfaces/Transaction'
import { ClientBase } from '../ClientBase'
/**
 * Client for the transaction getstatus
 */
export class ClientTransactionGettxreceiptstatus extends ClientBase implements IClientTransactionGetstatusRequest {

    /**
     * module to call
     */
    static module: string = 'transaction'
    /**
     * Action
     */
    static action: string = 'gettxreceiptstatus'

    /**
     * Hash of the transaction on the ethereum network
     */
    txhash: string

    constructor(txhash: string) {
        super()
        this.txhash = txhash
    }

    /**
     * Generates JSON for url generation
     */
    toJson(): any {
        return  {
            action: ClientTransactionGettxreceiptstatus.action,
            module: ClientTransactionGettxreceiptstatus.module,
            txhash: this.txhash.toString(),
        }
    }
}
