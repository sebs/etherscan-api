
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

// api key for etherscan.io
export class ApiKey extends EntityBase implements IEntity {
    public errorMessage: string =  'invalid'
    private apiKey
    private keyLength: number = 33
    constructor(apiKey: string) {
        super()
        this.apiKey = apiKey
    }

    public valid(): boolean {
        return this.apiKey.length !== this.keyLength
    }
}
