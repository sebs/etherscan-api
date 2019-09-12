import { Address } from '../../entities/Address'
import { IClientAccountTokenbalanceRequest } from '../../interfaces/Account'
import { ClientPagingBase } from '../ClientPagingBase'

/**
 * Client for the token balance
 */
export class ClientAccountTokenbalance extends ClientPagingBase implements IClientAccountTokenbalanceRequest {
    /**
     * module of the etherscan api to request
     */
    static module: string = 'account'
    /**
     * action of the etherscan api to request
     */
    static action: string = 'tokenbalance'
    /**
     * Address to lookup the account balance
     */
    address: Address
    /**
     * tag to limit the results
     */
    contractaddress: Address

    constructor(address: Address, contractaddress: Address) {
        super()
        this.address = address
        this.contractaddress = address
    }

    /**
     * generates a json represenatation of the
     */
    toJson(): any {
        return {
            action: ClientAccountTokenbalance.action,
            address: this.address.toString(),
            contractaddress: this.contractaddress.toString(),
            module: ClientAccountTokenbalance.module,
        }
    }
}
