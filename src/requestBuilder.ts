
const base =  'https://api.etherscan.io/api'
import { encode} from 'querystring'
import {
    account,
    block,
    contract,
    logs,
    proxy,
    stats,
    tokens,
    transaction,
} from './actions/index'
import { modules } from './modules'

const actions = new Map()
actions.set('account', account)
actions.set('block', block)
actions.set('contract', contract)
actions.set('logs', logs)
actions.set('proxy', proxy)
actions.set('stats', stats)
actions.set('tokens', tokens)
actions.set('transaction', transaction)

export const requestBuilder =  (module: string, action: string, params?: object): string => {

    if (!modules.get(module)) {
        throw Error('unknown module')
    }

    if (!actions.get(module).get(action)) {
        throw Error('unknown action')
    }

    const baseParams = {
        action,
        module,
    }

    const toEncodeParams = Object.assign(baseParams, params)
    const query: string = encode(toEncodeParams)
    
    return `${base}?${query}`
}
