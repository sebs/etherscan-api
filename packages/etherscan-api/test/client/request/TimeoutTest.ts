import test from 'ava'
import { ClientAccountBalance } from '../../../src/client/account/Balance'
import { Address } from '../../../src/entities/Address'
import { Network } from '../../../src/entities/Network'
import { performRequest } from '../../../src/util/performRequest'
import { requestUrlBuilder } from '../../../src/requestUrlBuilder'

const resultFixture = require('etherscan-api-test-fixtures/account/balance/address-latest.json')

const fetch = require('isomorphic-fetch')
const nock = require('nock')
import { parse } from 'url'

const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
const tag = 'latest'

test('timeout', async t => {
	const c = new ClientAccountBalance(new Address(address), tag)
	const json = c.toJson()
	const network = new Network()
	const url = requestUrlBuilder(network, 'account', 'balance', json)
	const parsedUrl = parse(url)

	const scope = nock(`${parsedUrl.protocol}//${parsedUrl.host}`)
		.get(parsedUrl.path)
		.delay(3500)
		.reply(200, resultFixture)	

	const promise = performRequest(network, 'account', 'balance', json)
	try {
		await promise
	} catch(e) {
		t.truthy(e)
		t.pass()
	}
	scope.done()
})
