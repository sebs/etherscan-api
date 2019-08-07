
import { Entity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

// a ethereum address
export class Address extends EntityBase implements Entity {
	public errorMessage:string =  'invalid'
	private address
	private regex = /0x[a-fA-F0-9]{40}/;

	constructor(address: string) {
		super()	
		this.address = address
	}

	valid(): boolean {
		return this.address.match(this.regex) !== null
	}
}