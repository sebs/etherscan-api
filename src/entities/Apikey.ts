
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

// api key for etherscan.io
export class ApiKey extends EntityBase implements IEntity {
    errorMessage: string =  'invalid'
    private keyLength: number = 34
    constructor(apiKey: string) {
        super(apiKey)
    }

    valid(): boolean {
        return this.value.length === this.keyLength
    }
}
