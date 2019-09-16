import { Address } from '../../entities/Address'
import { Operator } from '../../entities/Operator'
import { PositiveNumber } from '../../entities/PositiveNumber'
import { ClientBase } from '../ClientBase'
/**
 * Client for the stats chainsize
 */
export class ClientLogGetLogs extends ClientBase  {
    /**
     * Module to call
     */
    static module: string = 'log'
    /**
     * Action to call
     */
    static action: string = 'getLogs'
    /**
     * Block to start reading
     */
    fromBlock: PositiveNumber

    /**
     * End reading here
     */
    toBlock: PositiveNumber
    /**
     * Address to read from
     */
    address: Address
    /**
     * List of Topics with max 32 bytes
     */
    topics: string[]
    /**
     * Topic 0 to 1 Operator
     */
    topic01opr?: Operator
    /**
     * Topic 0 to 2 Operator
     */
    topic02opr?: Operator
    /**
     * Topic 1 to 2 Operator
     */
    topic12opr?: Operator
    /**
     * Topic 2 to 3 Operator
     */
    topic23opr?: Operator
    /**
     * Topic 0 to 3 Operator
     */
    topic03opr?: Operator
    /**
     * Topic 1 to 3 Operator
     */
    topic13opr?: Operator

    constructor(
        fromBlock: PositiveNumber,
        toBlock: PositiveNumber,
        address: Address,
        topics: string[],
        topic01opr?: Operator,
        topic12opr?: Operator,
        topic23opr?: Operator,
        topic02opr?: Operator,
        topic03opr?: Operator,
        topic13opr?: Operator) {
        super()
        this.fromBlock = fromBlock
        this.toBlock = toBlock
        this.address = address
        this.topics = topics
        this.topic01opr = topic01opr
        this.topic12opr = topic12opr
        this.topic23opr = topic23opr
        this.topic02opr = topic02opr
        this.topic03opr = topic03opr
        this.topic13opr = topic13opr
    }
    /**
     * Generate Json for url generation
     */
    toJson(): any {

        const returnValue: any = {
            action: ClientLogGetLogs.action,
            address: this.address.toString(),
            fromBlock: this.fromBlock.toString(),
            module: ClientLogGetLogs.module,
            toBlock: this.toBlock.toString(),
        }

        this.topics.map((topic, index) => {
            const indexName = 'topic' + index
            returnValue[indexName] = topic.toString()
        })
        /* tslint:disable:no-string-literal */
        if (!!this.topic01opr) {
            returnValue['topic0_1_opr'] = this.topic01opr.toString()
        }
        if (!!this.topic12opr) {
            returnValue['topic1_2_opr'] = this.topic12opr.toString()
        }
        if (!!this.topic02opr) {
            returnValue['topic0_2_opr'] = this.topic02opr.toString()
        }
        /* tslint:enable:no-string-literal */
        return returnValue
    }
}
