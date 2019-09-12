import { clienttypes } from '../parameters/clienttypes'
import { EntityBase } from './EntityBase'

/**
 * Value Object for the Clienttype
 */
export class Clienttype extends EntityBase {
    constructor(name: string = 'geth') {
        super(name)
    }
    /**
     * Chgecks of the value is valid
     */
    valid(): boolean {
        return Object.keys(clienttypes).includes(this.value)
    }
}
