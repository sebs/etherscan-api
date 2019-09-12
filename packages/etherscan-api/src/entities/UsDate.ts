import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

/**
 * Sort Parameter asc or desc
 */
export class UsDate extends EntityBase implements IEntity {
    /**
     * Error message to display when the value is invalid
     */
    errorMessage: string =  'invalid date supplied'

    constructor(dateString: string) {
        super(dateString)
    }
    /**
     * Validates if the error is invalid
     */
    valid(): boolean {
        return !!Date.parse(this.value)
    }
}
