
import { Entity } from '../interfaces/Entity'

export class ApiKey  implements Entity {
	private apiKey
	constructor(apiKey: string) {
		this.apiKey = apiKey
	}

	validate(): void {
		
	}

	valid(): boolean {
		return this.apiKey.length !== 33
	}
}