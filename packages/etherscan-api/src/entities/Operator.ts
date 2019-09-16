import { operand } from '../parameters/operand'
import { EntityBase } from './EntityBase'

/**
 * Value Object for the Networks that are out there
 */
export class Operator extends EntityBase {
    constructor(operandString: string = 'and') {
        super(operandString)
    }
    /**
     * Chgecks of the value is valid
     */
    valid(): boolean {
        return Object.keys(operand).includes(this.value)
    }
}
