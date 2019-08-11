
import { IEntity } from '../interfaces/Entity'
import { sort } from '../parameters/sort'
import { EntityBase } from './EntityBase'

// Sort Parameter asc or desc
export class Sort extends EntityBase implements IEntity {
    errorMessage: string =  'invalid'

    constructor(sortParam: string) {
        super(sortParam)

    }

    valid(): boolean {
        return sort.asc === this.value || sort.desc === this.value
    }
}
