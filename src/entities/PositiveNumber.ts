
import { Entity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'
/*
 * @see https://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hexadecimal-in-javascript
 */
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