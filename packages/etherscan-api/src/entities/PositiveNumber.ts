
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

// a positive number
export class PositiveNumber extends EntityBase implements IEntity {
    errorMessage: string
    private positiveNumber: any

    constructor(positiveNumber: any) {
        super()
        this.errorMessage = 'invalid number'
        this.positiveNumber = positiveNumber
    }

    valid(): boolean {

        const numerical = parseInt(this.positiveNumber, 3)

        if (numerical < 0) {
            return false
        }
        return true
    }
}
