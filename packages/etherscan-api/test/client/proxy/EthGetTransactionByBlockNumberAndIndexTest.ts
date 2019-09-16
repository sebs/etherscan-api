import test from 'ava'
import { ClientProxyEthGetTransactionByBlockNumberAndIndex } from '../../../src/client/proxy/EthGetTransactionByBlockNumberAndIndex'
import { Address } from '../../../src/entities/Address'

const tag = '0x10d4f'
const index = '0x0'

test('exists', t => {
	t.truthy(ClientProxyEthGetTransactionByBlockNumberAndIndex)
})

test('static properties are correct', t => {
	t.is(ClientProxyEthGetTransactionByBlockNumberAndIndex.module, 'proxy')
	t.is(ClientProxyEthGetTransactionByBlockNumberAndIndex.action, 'eth_getTransactionByBlockNumberAndIndex')
})

test('can be instantiated', t => {
	new ClientProxyEthGetTransactionByBlockNumberAndIndex(index, tag)
	t.pass()
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthGetTransactionByBlockNumberAndIndex(index, tag)
	const j = c.toJson()
	t.is(j.action, ClientProxyEthGetTransactionByBlockNumberAndIndex.action)
	t.is(j.module, ClientProxyEthGetTransactionByBlockNumberAndIndex.module)
	t.is(j.index, index)
	t.is(j.tag, tag)
})


