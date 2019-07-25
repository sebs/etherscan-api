import { mapFromArray } from './util/mapFromArray'
const moduleNames = [
	'account',
	'contract', 
	'transaction',
	'block',
	'logs',
	'proxy',
	'stats'
]
export const modules = mapFromArray(moduleNames)
