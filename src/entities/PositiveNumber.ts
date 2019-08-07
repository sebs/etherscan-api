
import { Entity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'

// a positive number
export class PositiveNumber extends EntityBase implements Entity {
	public errorMessage:string =  'invalid'
	private positiveNumber:any
	
	constructor(positiveNumber: any) {
		super()
		this.positiveNumber = positiveNumber
	}

	valid(): boolean {

		let numerical = parseInt(this.positiveNumber)

		if (numerical < 0) {
			return false
		}
		return true
	}
}