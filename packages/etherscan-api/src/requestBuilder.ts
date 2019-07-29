
const base =  'https://api.etherscan.io/api'
import { modules } from './modules'

export const requestBuilder =  function(module: string, action: string): string {

	if (!modules.get(module)) {
		throw Error('unknown module')
	}

	return `${base}?module=${module}&action=${action}`
}