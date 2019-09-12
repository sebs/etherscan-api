import { PositiveNumber } from '../../entities/PositiveNumber'
import { IClientBlockGetblockrewardRequest } from '../../interfaces/Block'
import { ClientBase } from '../ClientBase'
/**
 * Client for the transaction getstatus
 */
export class ClientBlockGetblockreward extends ClientBase implements IClientBlockGetblockrewardRequest {

    /**
     * module to call
     */
    static module: string = 'block'
    /**
     * Action
     */
    static action: string = 'getblockreward'

    /**
     * Hash of the transaction on the ethereum network
     */
    blockno: PositiveNumber

    constructor(blockno: PositiveNumber) {
        super()
        this.blockno = blockno
    }

    /**
     * Generates JSON for url generation
     */
    toJson(): any {
        return  {
            action: ClientBlockGetblockreward.action,
            blockno: this.blockno.toString(),
            module: ClientBlockGetblockreward.module,
        }
    }
}
