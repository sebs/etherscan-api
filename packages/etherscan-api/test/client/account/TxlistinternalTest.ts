import test from 'ava'
import { ClientAccountTxlistinternal } from '../../../src/client/account/Txlistinternal'
import { Address } from '../../../src/entities/Address'
import { Sort } from '../../../src/entities/Sort';
import { Paging } from '../../../src/entities/Paging';

const expectedUrl = 'http://api.etherscan.io/api?module=account&action=txlistinternal&address=0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3&startblock=0&endblock=2702578&sort=asc&apikey=YourApiKeyToken'
const startblock = '0'
const endblock = '2702578'
const address = '0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3'

test('exists', t => {
	t.truthy(ClientAccountTxlistinternal)
})

test('can be instantiated', t => {
	const oAddress = new Address(address)
 new ClientAccountTxlistinternal(oAddress, startblock, endblock)
 t.pass()
})

test('generates the right json', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTxlistinternal(oAddress, startblock, endblock)
	const j = c.toJson()
	t.is(j.module, ClientAccountTxlistinternal.module)
	t.is(j.action, ClientAccountTxlistinternal.action)
	t.is(j.address, oAddress.toString())
	t.is(j.startblock, startblock)
	t.is(j.endblock, endblock)
})


test('default sort', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTxlistinternal(oAddress, startblock, endblock)
	const j = c.toJson()
	t.is(j.sort, 'desc')
})

test('sort asc', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTxlistinternal(oAddress, startblock, endblock, new Sort('asc'))
	const j = c.toJson()
	t.is(j.sort, 'asc')
})

test('paging', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTxlistinternal(oAddress, startblock, endblock, new Sort('asc'),  new Paging())
	const j = c.toJson()
	t.is(j.page, '1')
	t.is(j.offset, '10')
})

test('paging absent from json if not set', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTxlistinternal(oAddress, startblock, endblock, new Sort('asc'))
	const j = c.toJson()
	t.falsy(j.offset)
	t.falsy(j.page)
})
