import { Address } from '../../entities/Address'
import { IClientContractGetabiRequest } from '../../interfaces/Contract'
import { ClientBase } from '../ClientBase'

/**
 * Client for the account balance
 */
export class ClientContractGetsource extends ClientBase implements IClientContractGetabiRequest {

    /**
     * module to call
     */
    static module: string = 'contract'
    /**
     * Action
     */
    static action: string = 'getsource'

    /**
     * Address on the ethereum network
     */
    address: Address

    constructor(address: Address) {
        super()
        this.address = address
    }

    /**
     * Generates JSON for url generation
     */
    toJson(): any {
        return  {
            action: ClientContractGetsource.action,
            address: this.address.toString(),
            module: ClientContractGetsource.module,
        }
    }
}
