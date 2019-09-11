import test from 'ava'
import { ClientAccountTxlistinternal } from '../../../src/client/account/Txlistinternal'
import { Address } from '../../../src/entities/Address'
import { Network } from '../../../src/entities/Network'
import { Sort } from '../../../src/entities/Sort'
import { performRequest } from '../../../src/util/performRequest'
import { requestUrlBuilder } from '../../../src/requestUrlBuilder'

const resultFixture = require('etherscan-api-test-fixtures/account/tokentx/address-startblock-endblock.json')

const fetch = require('isomorphic-fetch')
const nock = require('nock')
import { parse } from 'url'

const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'

test('default', async t => {
	const c = new ClientAccountTxlistinternal(new Address(address), '0', '999999', new Sort('desc'))
	const json = c.toJson()
	const network = new Network()
	const url = requestUrlBuilder(network, 'account', 'txlistinternal', json)
	const parsedUrl = parse(url)

	const scope = nock(`${parsedUrl.protocol}//${parsedUrl.host}`)
		.get(parsedUrl.path)
		.reply(200, resultFixture)	

	await performRequest(network, 'account', 'txlistinternal', json)
	scope.done()
	t.truthy(url)
})
