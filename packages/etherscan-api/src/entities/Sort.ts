
import { IEntity } from '../interfaces/Entity'
import { sort } from '../parameters/sort'
import { EntityBase } from './EntityBase'

/**
 * Sort Parameter asc or desc
 */
export class Sort extends EntityBase implements IEntity {
    /**
     * Error message to display when the value is invalid
     */
    errorMessage: string =  'invalid'

    constructor(sortParam: string = 'desc') {
        super(sortParam)

    }
    /**
     * Validates if the error is invalid
     */
    valid(): boolean {
        return sort.asc === this.value || sort.desc === this.value
    }
}
