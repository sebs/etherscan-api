import { syncmodes } from '../parameters/syncmodes'
import { EntityBase } from './EntityBase'

/**
 * Value Object for the Syncmode
 */
export class Syncmode extends EntityBase {
    constructor(name: string = 'default') {
        super(name)
    }
    /**
     * Chgecks of the value is valid
     */
    valid(): boolean {
        return Object.keys(syncmodes).includes(this.value)
    }
}
