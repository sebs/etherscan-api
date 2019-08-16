import test from 'ava'
import { ClientAccountTxlistinternalTxhash } from '../../src/client/ClientAccountTxlistinternalTxhash'
import { Address } from '../../src/entities/Address'
import { ApiKey } from '../../src/entities/Apikey'
import { decode } from 'querystring'
const nock = require('nock')
import { parse } from 'url'
import { readFile } from 'fs'
import { promisify } from 'util'
const _readFile = promisify(readFile)


const expectedUrl = 'https://api.etherscan.io/api?module=account&action=txlistinternal&txhash=0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170&apikey=YourApiKeyToken'
const startblock = '0'
const endblock = '2702578'
const txhash = '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170'
const apiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'

test('exists', t => {
	t.truthy(ClientAccountTxlistinternalTxhash)
})

test('can be instantiated', t => {
 const oApiKey = new ApiKey(apiKey)
 new ClientAccountTxlistinternalTxhash(oApiKey, 'account', 'txlistinternal', txhash, startblock, endblock)
 t.pass()
})

test('generates the right url', t => {

	const oApiKey = new ApiKey(apiKey)
	const c = new ClientAccountTxlistinternalTxhash(oApiKey, 'account', 'txlistinternal', txhash, startblock, endblock)
	const url = c.toUrl()

	const parsedUrl = decode(url)	
	const parsedExpectedUrl = decode(expectedUrl)
	
	t.is(parsedUrl.txhash, parsedExpectedUrl.txhash)
})
