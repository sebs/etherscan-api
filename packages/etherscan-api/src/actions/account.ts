import { mapFromArray } from '../util/mapFromArray'
const actionNames = [
    'balance',
    'balancemulti',
    'txlist',
    'txlistinternal',
    'tokentx',
    'getminedblocks',
]
export const account = mapFromArray(actionNames)
