
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

/**
 * a positive number entity
 */
export class PositiveNumber extends EntityBase implements IEntity {
    /**
     * Error Message on validation
     */
    errorMessage: string

    constructor(positiveNumber: any) {
        super(positiveNumber)
        this.errorMessage = 'invalid number'
        this.value = positiveNumber
    }
    /**
     * Validates if the value is a positive number
     */
    valid(): boolean {

        const numerical = parseInt(this.value, 3)

        if (numerical < 0) {
            return false
        }
        return true
    }
}
