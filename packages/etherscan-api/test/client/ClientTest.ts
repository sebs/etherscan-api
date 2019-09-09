import test from 'ava'
import { Client } from '../../src/Client'
import { decode } from 'querystring'
const nock = require('nock')
import { parse } from 'url'
const resultFixture = require('etherscan-api-test-fixtures/account/balance/address-latest.json')
const fecth = require('isomorphic-fetch')
const apiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
const tag = 'latest'
const expectedUrl = 'https://api.etherscan.io/api?action=balance&module=account&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&apiKey=TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W&tag=latest'
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

