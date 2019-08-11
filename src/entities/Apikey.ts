
import { IEntity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

/**
 * Api key for etherscan.io
 */
export class ApiKey extends EntityBase implements IEntity {
    /**
     * Error Message for validation errors
     */
    errorMessage: string =  'invalid'
    /**
     * Key lenght of a apiKey
     */
    private keyLength: number = 34
    constructor(apiKey: string) {
        super(apiKey)
    }
    /**
     * Checks validty of a apiKey
     */
    valid(): boolean {
        return this.value.length === this.keyLength
    }
}
