export const modules = new Map()
const moduleNames = [
	'account',
	'contract', 
	'transaction',
	'block',
	'logs',
	'proxy',
	'stats'
]
moduleNames.map(name => modules.set(name, name))
