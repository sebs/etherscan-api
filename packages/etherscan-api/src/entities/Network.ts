import { networks } from '../parameters/networks'
import { EntityBase } from './EntityBase'

/**
 * Value Object for the Networks that are out there
 */
export class Network extends EntityBase {
    constructor(name: string = 'homestead') {
        super(name)
    }
    /**
     * Chgecks of the value is valid
     */
    valid(): boolean {
        return Object.keys(networks).includes(this.value)
    }
    /**
     * Gets the base url for each API
     */
    toUrl() {
        const enumVal: string = (networks as any)[this.value] as string
        return enumVal
    }
}
