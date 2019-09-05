import { EntityBase } from './EntityBase'
import { PositiveNumber } from './PositiveNumber'
import { Sort } from './Sort'

/**
 * A simple paging class
 */
export class Paging extends EntityBase {
    /**
     * Page we are using
     */
    private page: PositiveNumber
    /**
     * offset
     */
    private offset: PositiveNumber
    /**
     * How to sort (asc/desc)
     */
    private sort: Sort

    constructor(
            page: PositiveNumber = new PositiveNumber(1),
            offset: PositiveNumber = new PositiveNumber(0),
            sort: Sort = new Sort('asc'),
        ) {
        super(page.toString())
        this.page = page
        this.offset = offset
        this.sort = sort
    }
    /**
     * Validates the paging
     */
    valid(): boolean {
        return  !!this.page && !!this.sort && !!this.offset
    }
}
