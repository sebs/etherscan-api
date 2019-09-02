import test from 'ava'
import { ClientAccountTxlist } from '../../src/client/ClientAccountTxlist'
import { Address } from '../../src/entities/Address'
import { ApiKey } from '../../src/entities/Apikey'
import { decode } from 'querystring'
const nock = require('nock')
import { parse } from 'url'
import { readFile } from 'fs'
import { promisify } from 'util'
const _readFile = promisify(readFile)

const apiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
const address = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a'
const startblock = '0'
const endblock = '99999999'
const expectedUrl = 'http://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken'

test('exists', t => {
	t.truthy(ClientAccountTxlist)
})

test('can be instantiated', t => {
 	const oAddress = new Address(address)
	const oApiKey = new ApiKey(apiKey)
	new ClientAccountTxlist(oApiKey, oAddress, startblock, endblock)
	t.pass()
})

test('generates the right url', t => {
	const oAddress = new Address(address)
	const oApiKey = new ApiKey(apiKey)
	const c = new ClientAccountTxlist(oApiKey, oAddress, startblock, endblock)
	const url = c.toUrl()

	const parsedUrl = decode(url)	
	const parsedExpectedUrl = decode(expectedUrl)
	
	t.is(parsedUrl.address, parsedExpectedUrl.address)
	t.is(parsedUrl.startblock, parsedExpectedUrl.startblock)
	t.is(parsedUrl.endblock, parsedExpectedUrl.endblock)
})

test('sort', t => {
	const oAddress = new Address(address)
	const oApiKey = new ApiKey(apiKey)
	const c = new ClientAccountTxlist(oApiKey, oAddress, startblock, endblock, 'desc')
	const url = c.toUrl()
	const parsedUrl = decode(url)	
	t.is(parsedUrl.sort, 'desc')
})

test('start end endblock', t => {
	const oAddress = new Address(address)
	const oApiKey = new ApiKey(apiKey)
	const c = new ClientAccountTxlist(oApiKey, oAddress, startblock, endblock, 'desc', '10')
	const url = c.toUrl()
	const parsedUrl = decode(url)	
	t.is(parsedUrl.page, '10')
})

test('actually request and get an response ordering', async t => {
	const expectedUrl = 'http://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken'
	const fixtureLocation= './test/fixtures/account/txlist/address-startblock-endblock.json'

	const oAddress = new Address(address)
	const oApiKey = new ApiKey(apiKey)
	const c = new ClientAccountTxlist(oApiKey, oAddress, startblock, endblock)
	
	const resultFixture = await _readFile(fixtureLocation, 'utf-8')
	const parsedUrl = parse(c.toUrl())

	nock(`${parsedUrl.protocol}//${parsedUrl.host}`)
		.get(parsedUrl.path)
		.reply(200, resultFixture)	

	const result = await c.request()
	t.truthy(result)
})

test('actually request and get an response with ordering but without paging', async t => {
	const fixtureLocation= './test/fixtures/account/txlist/address-startblock-endblock.json'

	const oAddress = new Address(address)
	const oApiKey = new ApiKey(apiKey)
	const c = new ClientAccountTxlist(oApiKey, oAddress, startblock, endblock, 'desc')
	
	const resultFixture = await _readFile(fixtureLocation, 'utf-8')
	const parsedUrl = parse(c.toUrl())

	nock(`${parsedUrl.protocol}//${parsedUrl.host}`)
		.get(parsedUrl.path)
		.reply(200, resultFixture)	

	const result = await c.request()
	t.truthy(result)
})

test('actually request and get an response with ordering and paging' , async t => { 
	const fixtureLocation= './test/fixtures/account/txlist/address-startblock-endblock-paging.json'
	const oAddress = new Address(address)
	const oApiKey = new ApiKey(apiKey)

	const c = new ClientAccountTxlist(oApiKey, oAddress, startblock, endblock, 'desc', '1', '10')

	const resultFixture = await _readFile(fixtureLocation, 'utf-8')
	const parsedUrl = parse(c.toUrl())

	nock(`${parsedUrl.protocol}//${parsedUrl.host}`)
		.get(parsedUrl.path)
		.reply(200, resultFixture)	
	
	const result = await c.request()
	t.is(typeof result, 'object')
	t.truthy(result)

});

