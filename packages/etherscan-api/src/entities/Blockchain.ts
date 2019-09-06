import { blockchains } from '../parameters/blockchains'
import { EntityBase } from './EntityBase'

/**
 * Value Object for the blockchains that are out there
 */
export class Blockchain extends EntityBase {
    constructor(name: string = 'rinkeby') {
        super(name)
    }
    /**
     * Chgecks of the value is valid
     */
    valid(): boolean {
        return Object.keys(blockchains).includes(this.value)
    }
    /**
     * Gets the base url for each API
     */
    toUrl() {
        const enumVal: string = (blockchains as any)[this.value] as string
        return enumVal
    }
}
