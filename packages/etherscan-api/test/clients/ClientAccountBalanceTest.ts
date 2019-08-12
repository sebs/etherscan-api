import test from 'ava'
import { Client } from '../../src/Client'
import { decode } from 'querystring'
const nock = require('nock')
import { parse } from 'url'
import { readFile } from 'fs'
import { promisify } from 'util'
const _readFile = promisify(readFile)



const apiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
const tag = 'latest'
const expectedUrl = 'https://api.etherscan.io/api?action=balance&module=account&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&apiKey=TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W&tag=latest'
const fixtureLocation= './test/fixtures/account/balance/address-latest.json'

test('account api with valid action', t =>  {
	const client = new Client(apiKey)
	client.account('balance')
	t.pass()
})

test('account api with valid action', t =>  {
	const client = new Client(apiKey)
	const res = client.account('balance')
	t.is(typeof res, 'function')
})

test('executing the function', t =>  {
	const client = new Client(apiKey)
	const concreteClient = client.account('balance')(address, tag)
	t.truthy(concreteClient)
})

test('no param translates to [object Object]', t =>  {
	const client = new Client(apiKey)
	const url = client.account('balance')(address, tag).toUrl()
	const parsedQuery = decode(url)
	t.not(parsedQuery.apiKey, '[object Object]')
	t.not(parsedQuery.module, '[object Object]')
	t.not(parsedQuery.account, '[object Object]')
	t.not(parsedQuery.address, '[object Object]')
})

test('the correct url is generated', t =>  {
	const client = new Client(apiKey)
	const url = client.account('balance')(address, tag).toUrl()
	t.is(url, expectedUrl)
})

test('actually request and get an response', async t => {
	const client = new Client(apiKey)
	const accountClient = client.account('balance')(address, tag)
	const resultFixture = await _readFile(fixtureLocation, 'utf-8')
	const parsedUrl = parse(accountClient.toUrl())

	nock(`${parsedUrl.protocol}//${parsedUrl.host}`)
		.get(parsedUrl.path)
		.reply(200, resultFixture)	

	const result = await accountClient.request()
	t.truthy(result)
})