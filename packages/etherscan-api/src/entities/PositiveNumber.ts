
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

// a positive number
export class PositiveNumber extends EntityBase implements IEntity {
    errorMessage: string

    constructor(positiveNumber: any) {
        super(positiveNumber)
        this.errorMessage = 'invalid number'
        this.value = positiveNumber
    }

    valid(): boolean {

        const numerical = parseInt(this.value, 3)

        if (numerical < 0) {
            return false
        }
        return true
    }
}
