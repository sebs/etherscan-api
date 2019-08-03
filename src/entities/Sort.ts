
import { Entity } from '../interfaces/Entity'
import { EntityBase } from './EntityBase'
import { sort } from '../parameters/sort'

export class Sort extends EntityBase implements Entity {
	public errorMessage:string =  'invalid'
	private sortParam:string
	
	constructor(sortParam: string) {
		super()
		this.sortParam = sortParam
	}

	valid(): boolean {
		return sort.asc === this.sortParam || sort.desc === this.sortParam
	}
}