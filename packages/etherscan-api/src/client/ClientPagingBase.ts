import { Paging } from '../entities/Paging'
import { PositiveNumber } from '../entities/PositiveNumber'
import { ClientBase } from './ClientBase'

/**
 * Basic paging base class
 */
export class ClientPagingBase extends ClientBase {
    /**
     *  Paging with the correct defaults
     */
    protected paging?: Paging = new Paging(
        new PositiveNumber('1'),
        new PositiveNumber('10'),
    )
    /**
     * Sets new values for paging
     * @param page Page to show
     * @param offset number of entries
     */
    setPaging(page: string, offset: string) {
        this.paging = new Paging(
            new PositiveNumber(page),
            new PositiveNumber(offset),
        )
    }
    /**
     * Adds the paging information to the json
     * @param json
     */
    addPagingToJson(json: any) {
        const pagingJson = this.paging ? this.paging.toJson() : {}
        return Object.assign(json, pagingJson)
    }
}
