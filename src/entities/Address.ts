
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

// a ethereum address
export class Address extends EntityBase implements IEntity {

    private regex = /0x[a-fA-F0-9]{40}/

    constructor(address: string) {
        super(address)
        this.errorMessage = 'Invalid Address'
    }

    valid(): boolean {
        return this.value.match(this.regex) !== null
    }
}
