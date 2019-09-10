import { EntityBase } from './EntityBase'
import { PositiveNumber } from './PositiveNumber'

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

    constructor(
            page: PositiveNumber = new PositiveNumber(1),
            offset: PositiveNumber = new PositiveNumber(10),
        ) {
        super(page.toString())
        this.page = page
        this.offset = offset
    }
    /**
     * Validates the paging
     */
    valid(): boolean {
        return  !!this.page && !!this.offset
    }
    /**
     * Generates a string representing the data for paging
     */
    toString(): string {
        return `Page: ${this.page.toString()}, Offset:  ${this.offset.toString()}`
    }

    /**
     * Generates an object representing the sort parameters
     */
    toJson(): any {
        const page = this.page.toString()
        const offset = this.offset.toString()
        return {
            offset,
            page,
        }
    }
}
