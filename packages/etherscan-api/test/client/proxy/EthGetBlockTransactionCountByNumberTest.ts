import test from 'ava'
import { ClientProxyEthGetBlockTransactionCountByNumber } from '../../../src/client/proxy/EthGetBlockTransactionCountByNumber'
const tag = '0x10d4f'


test('exists', t => {
	t.truthy(ClientProxyEthGetBlockTransactionCountByNumber)
})

test('can be instantiated', t => {
	new ClientProxyEthGetBlockTransactionCountByNumber(tag)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthGetBlockTransactionCountByNumber.module, 'proxy')
	t.is(ClientProxyEthGetBlockTransactionCountByNumber.action, 'eth_getBlockTransactionCountByNumber')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthGetBlockTransactionCountByNumber(tag)
	const j = c.toJson()
	t.is(j.action, ClientProxyEthGetBlockTransactionCountByNumber.action)
	t.is(j.module, ClientProxyEthGetBlockTransactionCountByNumber.module)
	t.is(j.tag, tag)
})
