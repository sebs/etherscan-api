import test from 'ava'
import { ClientProxyEthGetblockByNumber } from '../../../src/client/proxy/EthGetblockByNumber'
const tag = '0x10d4f'
const bool: boolean = true

test('exists', t => {
	t.truthy(ClientProxyEthGetblockByNumber)
})

test('can be instantiated', t => {
	new ClientProxyEthGetblockByNumber(tag, bool)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthGetblockByNumber.module, 'proxy')
	t.is(ClientProxyEthGetblockByNumber.action, 'eth_getBlockByNumber')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthGetblockByNumber(tag, bool)
	const j = c.toJson()
	t.is(j.action, ClientProxyEthGetblockByNumber.action)
	t.is(j.module, ClientProxyEthGetblockByNumber.module)
	t.is(j.boolean, 'true')
	t.is(j.tag, tag)
})
