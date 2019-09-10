import test from 'ava'
import { ClientAccountTxlist } from '../../../src/client/account/Txlist'
import { Address } from '../../../src/entities/Address'
import { Paging } from '../../../src/entities/Paging';
import { Sort } from '../../../src/entities/Sort';
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
	t.is(json.action, ClientAccountTxlist.action)
	t.is(json.module, ClientAccountTxlist.module)
	t.is(json.address, address)
	t.is(json.startblock, startblock)
	t.is(json.endblock, endblock)
})


test('default sort', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTxlist(oAddress, startblock, endblock)
	const json = c.toJson()
	t.is(json.sort, 'desc')
})

test('sort asc', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTxlist(oAddress, startblock, endblock, new Sort('asc'))
	const json = c.toJson()
	t.is(json.sort, 'asc')
})

test('paging absent if not set', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTxlist(oAddress, startblock, endblock, new Sort('asc'))
	const json = c.toJson()
	t.falsy(json.offset)
	t.falsy(json.page)
})

test('paging', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTxlist(oAddress, startblock, endblock, new Sort(), new Paging())
	const json = c.toJson()
	t.is(json.page, '1')
	t.is(json.offset, '10')
})