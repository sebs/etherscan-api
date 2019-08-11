
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'
/**
 * Hex representation of a quantity
 * @see https://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hexadecimal-in-javascript
 */
export class HexQuantity extends EntityBase implements IEntity {
    /**
     * Error Message
     */
    errorMessage: string =  'invalid'
    constructor(hexString: string) {
        super(hexString)
    }
    /**
     * Validates a hex quantity
     */
    valid(): boolean {
        const a = parseInt(this.value, 16)
        return (a.toString(16) === this.value)
    }
}
