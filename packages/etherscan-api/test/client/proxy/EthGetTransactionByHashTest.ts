import test from 'ava'
import { ClientProxyEthGetTransactionByHash } from '../../../src/client/proxy/EthGetTransactionByHash'

const txhash = '0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1'
test('exists', t => {
	t.truthy(ClientProxyEthGetTransactionByHash)
})

test('can be instantiated', t => {
	new ClientProxyEthGetTransactionByHash(txhash)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthGetTransactionByHash.module, 'proxy')
	t.is(ClientProxyEthGetTransactionByHash.action, 'eth_getTransactionByHash')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthGetTransactionByHash(txhash)
	const j = c.toJson()
	t.is(j.action, ClientProxyEthGetTransactionByHash.action)
	t.is(j.module, ClientProxyEthGetTransactionByHash.module)
	t.is(j.txhash, txhash)
})
