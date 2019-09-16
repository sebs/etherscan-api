import test from 'ava'
import { ClientProxyEthGetTransactionCount } from '../../../src/client/proxy/EthGetTransactionCount'
import { Address } from '../../../src/entities/Address'
const address = new Address('0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1')

test('exists', t => {
	t.truthy(ClientProxyEthGetTransactionCount)
})

test('can be instantiated', t => {
	new ClientProxyEthGetTransactionCount(address)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthGetTransactionCount.module, 'proxy')
	t.is(ClientProxyEthGetTransactionCount.action, 'eth_getTransactionCount')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthGetTransactionCount(address)
	const j = c.toJson()
	t.is(j.action, ClientProxyEthGetTransactionCount.action)
	t.is(j.module, ClientProxyEthGetTransactionCount.module)
	t.is(j.address, address.toString())
})
