import test from 'ava'
import { ClientAccountTxlistinternal } from '../../src/client/ClientAccountTxlistinternal'
import { Address } from '../../src/entities/Address'
import { ApiKey } from '../../src/entities/Apikey'
import { decode } from 'querystring'
const nock = require('nock')
import { parse } from 'url'
import { readFile } from 'fs'
import { promisify } from 'util'
const _readFile = promisify(readFile)


const expectedUrl = 'http://api.etherscan.io/api?module=account&action=txlistinternal&address=0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3&startblock=0&endblock=2702578&sort=asc&apikey=YourApiKeyToken'
const startblock = '0'
const endblock = '2702578'
const address = '0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3'
const apiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'

test('exists', t => {
	t.truthy(ClientAccountTxlistinternal)
})

test('can be instantiated', t => {
	const oAddress = new Address(address)
 const oApiKey = new ApiKey(apiKey)
 new ClientAccountTxlistinternal(oApiKey, 'account', 'txlistinternal', oAddress, startblock, endblock)
 t.pass()
})

test('generates the right url', t => {
	const oAddress = new Address(address)
	const oApiKey = new ApiKey(apiKey)
	const c = new ClientAccountTxlistinternal(oApiKey, 'account', 'txlistinternal', oAddress, startblock, endblock)
	const url = c.toUrl()

	const parsedUrl = decode(url)	
	const parsedExpectedUrl = decode(expectedUrl)
	
	t.is(parsedUrl.address, parsedExpectedUrl.address)
	t.is(parsedUrl.startblock, parsedExpectedUrl.startblock)
	t.is(parsedUrl.endblock, parsedExpectedUrl.endblock)
})