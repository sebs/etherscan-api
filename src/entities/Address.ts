
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

// a ethereum address
export class Address extends EntityBase implements IEntity {
    private address: string
    private regex = /0x[a-fA-F0-9]{40}/

    constructor(address: string) {
        super()
        this.errorMessage = 'Invalid Address'
        this.address = address
    }

    valid(): boolean {
        return this.address.match(this.regex) !== null
    }
}
