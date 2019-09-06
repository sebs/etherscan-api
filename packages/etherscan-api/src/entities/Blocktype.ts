
import { IEntity } from '../interfaces/Entity'
import { blocktypes } from '../parameters/blocktypes'
import { EntityBase } from './EntityBase'

/**
 * Blocktypes: blocks or uncles
 */
export class Blocktypes extends EntityBase implements IEntity {
    /**
     * Error message to display when the value is invalid
     */
    errorMessage: string =  'invalid'

    constructor(sortParam: string) {
        super(sortParam)
    }
    /**
     * Validates if the error is invalid
     */
    valid(): boolean {
        return blocktypes.uncles === this.value || blocktypes.blocks === this.value
    }
}
