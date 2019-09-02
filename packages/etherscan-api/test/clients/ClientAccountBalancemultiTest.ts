import test from 'ava'
import { ClientAccountBalancemulti } from '../../src/client/ClientAccountBalancemulti'
import { Address } from '../../src/entities/Address'
import { ApiKey } from '../../src/entities/Apikey'
import { decode } from 'querystring'
const nock = require('nock')
import { parse } from 'url'
import { readFile } from 'fs'
import { promisify } from 'util'
const _readFile = promisify(readFile)

const apiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
const address = [ 
	'0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
	'0x63a9975ba31b0b9626b34300f7f627147df1f526',
	'0x198ef1ec325a96cc354c7266a038be8b5c558f67'
]
const tag = 'latest'
const expectedUrl = 'https://api.etherscan.io/api?action=balancemulti&module=account&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a,0x63a9975ba31b0b9626b34300f7f627147df1f526,0x198ef1ec325a96cc354c7266a038be8b5c558f67&tag=latest&apikey=YourApiKeyToken'
const fixtureLocation= './test/fixtures/account/balancemulti/address-latest.json'

test('exists', t => {
	t.truthy(ClientAccountBalancemulti)
})

test('can be instantiated', t => {
	const arrAddress = address.map(a =>  new Address(a))
	const oApiKey = new ApiKey(apiKey)
	new ClientAccountBalancemulti(oApiKey, arrAddress, tag)
	t.pass()
})

test('generates the right url', t => {
	const arrAddress = address.map(a =>  new Address(a))
	const oApiKey = new ApiKey(apiKey)
	const c = new ClientAccountBalancemulti(oApiKey, arrAddress, tag)
	const url = c.toUrl()

	const parsedUrl = decode(url)
	const parsedExpectedUrl = decode(expectedUrl)

	t.is(parsedUrl.action, parsedExpectedUrl.action, 'actionnot as expected')
	t.is(parsedUrl.module, parsedExpectedUrl.module)
	t.is(parsedUrl.address, parsedExpectedUrl.address)
	t.is(parsedUrl.tag, parsedExpectedUrl.tag)
})

test('actually request and get an response', async t => {
	const arrAddress = address.map(a =>  new Address(a))
	const oApiKey = new ApiKey(apiKey)
	const c = new ClientAccountBalancemulti(oApiKey, arrAddress, tag)
	const url = c.toUrl()
	const parsedUrl = parse(url)
	const resultFixture = await _readFile(fixtureLocation, 'utf-8')

	nock(`${parsedUrl.protocol}//${parsedUrl.host}`)
		.get(parsedUrl.path)
		.reply(200, resultFixture)	

	const result = await c.request()
	t.truthy(result)
})
