import test from 'ava'
import { ClientAccountTxlistinternalTxhash } from '../../../src/client/account/TxlistinternalTxhash'
import { Sort } from '../../../src/entities/Sort';
import { Paging } from '../../../src/entities/Paging';
const expectedUrl = 'https://api.etherscan.io/api?module=account&action=txlistinternal&txhash=0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170&apikey=YourApiKeyToken'
const startblock = '0'
const endblock = '2702578'
const txhash = '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170'

test('exists', t => {
	t.truthy(ClientAccountTxlistinternalTxhash)
})

test('can be instantiated', t => {
	const c = new ClientAccountTxlistinternalTxhash(txhash, startblock, endblock)
	t.pass()
})

test('creates correct json', t => {
	const c = new ClientAccountTxlistinternalTxhash(txhash, startblock, endblock)
	const j = c.toJson()
	t.is(j.module, ClientAccountTxlistinternalTxhash.module)
	t.is(j.action, ClientAccountTxlistinternalTxhash.action)
	t.is(j.startblock, startblock)
	t.is(j.endblock, endblock)
	t.is(j.txhash, txhash)
})

test('default sort', t => {
	const c = new ClientAccountTxlistinternalTxhash(txhash, startblock, endblock)
	const j = c.toJson()
	t.is(j.sort, 'desc')
})

test('sort asc', t => {
	const c = new ClientAccountTxlistinternalTxhash(txhash, startblock, endblock, new Sort('asc'))
	const j = c.toJson()
	t.is(j.sort, 'asc')
})

test('paging', t => {
	const c = new ClientAccountTxlistinternalTxhash(txhash, startblock, endblock, new Sort(), new Paging())
	const j = c.toJson()
	t.is(j.page, '1')
	t.is(j.offset, '10')
})