import { Clienttype } from '../../entities/Clienttype'
import { Syncmode } from '../../entities/Syncmode'
import { UsDate } from '../../entities/UsDate'
import { IClientStatsChainsizeRequest } from '../../interfaces/Stats'
import { ClientBase } from '../ClientBase'

/**
 * Client for the stats chainsize
 */
export class ClientStatsChainsize extends ClientBase implements IClientStatsChainsizeRequest {
    /**
     * Module to call
     */
    static module: string = 'stats'
    /**
     * Action to call
     */
    static action: string = 'chainsize'
    /**
     * Starting date
     */
    startdate: UsDate
    /**
     * End date
     */
    enddate: UsDate
    /**
     * Syncmode
     */
    syncmode: Syncmode
    /**
     * Cloienttype
     */
    clienttype: Clienttype

    constructor(
        startdate: UsDate,
        enddate: UsDate,
        clienttype: Clienttype = new Clienttype(),
        syncmode: Syncmode = new Syncmode(),
        ) {
            super()
            this.startdate = startdate
            this.enddate = enddate
            this.syncmode = syncmode
            this.clienttype = clienttype
    }

    /**
     * Generates a json representation
     */
    toJson(): any {
        return {
            action: ClientStatsChainsize.action,
            clienttype: this.clienttype.toString(),
            enddate: this.enddate.toString(),
            module: ClientStatsChainsize.module,
            startdate: this.startdate.toString(),
            syncmode: this.syncmode.toString(),
        }
    }
}
