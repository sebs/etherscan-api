import { mapFromArray } from '../util/mapFromArray'
const actionNames = [
    'ethsupply',
    'ethprice',
    'chainsize',
    'tokensupply',
]
export const stats = mapFromArray(actionNames)
