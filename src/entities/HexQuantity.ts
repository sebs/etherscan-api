
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'
/*
 * @see https://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hexadecimal-in-javascript
 */
export class HexQuantity extends EntityBase implements IEntity {
    errorMessage: string =  'invalid'
    constructor(hexString: string) {
        super(hexString)
    }

    valid(): boolean {
        const a = parseInt(this.value, 16)
        return (a.toString(16) === this.value)
    }
}
