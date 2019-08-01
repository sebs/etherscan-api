
import { Entity } from '../interfaces/Entity'

export class ApiKey implements Entity {
	private apiKey
	private keyLength: number = 33
	constructor(apiKey: string) {
		this.apiKey = apiKey
	}

	validate(): void {
		if (!this.valid()) {
			throw new Error('invalid')
		}
	}

	valid(): boolean {
		return this.apiKey.length !== this.keyLength
	}
}