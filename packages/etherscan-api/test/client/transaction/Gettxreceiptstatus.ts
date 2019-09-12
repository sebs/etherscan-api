import test from 'ava'
import { ClientTransactionGettxreceiptstatus } from '../../../src/client/transaction/Gettxreceiptstatus'

const txhash = '0x15f8e5ea1079d9a0bb04a4c58ae5fe7654b5b2b4463375ff7ffb490aa0032f3a'

test('exists', t => {
	t.truthy(ClientTransactionGettxreceiptstatus)
})

test('can be instantiated', t => {
	new ClientTransactionGettxreceiptstatus(txhash)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientTransactionGettxreceiptstatus.module, 'transaction')
	t.is(ClientTransactionGettxreceiptstatus.action, 'gettxreceiptstatus')
})

test('creates the correct json', t => {
	const c = new ClientTransactionGettxreceiptstatus(txhash)
	const j = c.toJson()
	t.is(j.module, ClientTransactionGettxreceiptstatus.module)
	t.is(j.action, ClientTransactionGettxreceiptstatus.action)
	t.is(j.txhash, txhash)
})
