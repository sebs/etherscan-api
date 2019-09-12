import { mapFromArray } from '../util/mapFromArray'
const actionNames = [
    'balance',
    'balancemulti',
    'txlist',
    'txlistinternal',
    'tokentx',
    'tokenbalance',
    'getminedblocks',
]
export const account = mapFromArray(actionNames)
