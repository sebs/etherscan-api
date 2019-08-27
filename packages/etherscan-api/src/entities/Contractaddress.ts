
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

/**
 * A ethereum address
 */
export class Contractaddress extends EntityBase implements IEntity {

    constructor(address: string) {
        super(address)
        this.errorMessage = 'Invalid Address'
    }
    /**
     * Checks validity of the address
     */
    valid(): boolean {
        const regex = /0x[a-fA-F0-9]{40}/
        return this.value.match(regex) !== null
    }
}
