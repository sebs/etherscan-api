import { mapFromArray } from '../util/mapFromArray'
const actionNames = [
    'eth_Blocknumber',
    'eth_getBlockByNumber',
    'eth_getBlockByNumberAndIndex',
    'eth_getBlockTransactionCountByNumber',
    'eth_getTransactionByHash',
    'eth_getTransactionByBlockNumberAndIndex',
    'eth_getUncleByBlockNumberAndIndex',
    'eth_getTransactionCount',
    'eth_sendRawTransaction',
    'eth_getTransactionReceipt',
    'eth_call',
    'eth_getCode',
    'eth_getStorageAt',
    'eth_gasPrice',
    'eth_estimateGas',
]
export const proxy = mapFromArray(actionNames)
