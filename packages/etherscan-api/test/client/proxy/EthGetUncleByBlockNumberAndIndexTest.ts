import test from 'ava'
import { ClientProxyEthGetUncleByBlockNumberAndIndex } from '../../../src/client/proxy/EthGetUncleByBlockNumberAndIndex'

const tag = '0x210A9B'
const index = '0x0'

test('exists', t => {
	t.truthy(ClientProxyEthGetUncleByBlockNumberAndIndex)
})

test('can be instantiated', t => {
	new ClientProxyEthGetUncleByBlockNumberAndIndex(index, tag)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthGetUncleByBlockNumberAndIndex.module, 'proxy')
	t.is(ClientProxyEthGetUncleByBlockNumberAndIndex.action, 'eth_getUncleByBlockNumberAndIndex')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthGetUncleByBlockNumberAndIndex(index, tag)
	const j = c.toJson()
	t.is(j.action, ClientProxyEthGetUncleByBlockNumberAndIndex.action)
	t.is(j.module, ClientProxyEthGetUncleByBlockNumberAndIndex.module)
	t.is(j.tag, tag)
	t.is(j.index, index)
})
