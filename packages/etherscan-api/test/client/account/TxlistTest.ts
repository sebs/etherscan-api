import test from 'ava'
import { ClientAccountTxlist } from '../../../src/client/account/Txlist'
import { Address } from '../../../src/entities/Address'

const fetch = require('isomorphic-fetch');

const address = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a'
const startblock = '0'
const endblock = '99999999'
const expectedUrl = 'http://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken'

test('exists', t => {
	t.truthy(ClientAccountTxlist)
})

test('can be instantiated', t => {
 	const oAddress = new Address(address)
	new ClientAccountTxlist(oAddress, startblock, endblock)
	t.pass()
})

test('creates correct json', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTxlist(oAddress, startblock, endblock)
	const json = c.toJson()
	t.is(json.action, 'txlist')
	t.is(json.module, 'account')
	t.is(json.address, address)
	t.is(json.sort, 'desc')
	t.is(json.startblock, startblock)
	t.is(json.endblock, endblock)
})


