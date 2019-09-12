import test from 'ava'
import { ClientTransactionGetstatus } from '../../../src/client/transaction/Getstatus'

const txhash = '0x15f8e5ea1079d9a0bb04a4c58ae5fe7654b5b2b4463375ff7ffb490aa0032f3a'

test('exists', t => {
	t.truthy(ClientTransactionGetstatus)
})

test('can be instantiated', t => {
	new ClientTransactionGetstatus(txhash)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientTransactionGetstatus.module, 'transaction')
	t.is(ClientTransactionGetstatus.action, 'getstatus')
})

test('creates the correct json', t => {
	const c = new ClientTransactionGetstatus(txhash)
	const j = c.toJson()
	t.is(j.module, ClientTransactionGetstatus.module)
	t.is(j.action, ClientTransactionGetstatus.action)
	t.is(j.txhash, txhash)
})
