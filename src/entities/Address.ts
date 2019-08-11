
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

/**
 * A ethereum address
 */
export class Address extends EntityBase implements IEntity {
    /**
     * Regular expression to validate a ethereum address
     */
    private regex = /0x[a-fA-F0-9]{40}/

    constructor(address: string) {
        super(address)
        this.errorMessage = 'Invalid Address'
    }
    /**
     * Checks validity of the address
     */
    valid(): boolean {
        return this.value.match(this.regex) !== null
    }
}
