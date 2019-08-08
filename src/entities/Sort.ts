
import { IEntity } from '../interfaces/Entity'
import { sort } from '../parameters/sort'
import { EntityBase } from './EntityBase'

// Sort Parameter asc or desc
export class Sort extends EntityBase implements IEntity {
    errorMessage: string =  'invalid'
    private sortParam: string

    constructor(sortParam: string) {
        super()
        this.sortParam = sortParam
    }

    valid(): boolean {
        return sort.asc === this.sortParam || sort.desc === this.sortParam
    }
}
