
const base =  'https://api.etherscan.io/api'

export const requestBuilder =  function(module:string, action:string):string {
	return `${base}?module=${module}&action=${action}`
}