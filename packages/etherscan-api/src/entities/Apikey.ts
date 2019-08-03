
import { Entity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

export class ApiKey extends EntityBase implements Entity {
	public errorMessage:string =  'invalid'
	private apiKey
	private keyLength: number = 33
	constructor(apiKey: string) {
		super()
		this.apiKey = apiKey
	}

	valid(): boolean {
		return this.apiKey.length !== this.keyLength
	}
}