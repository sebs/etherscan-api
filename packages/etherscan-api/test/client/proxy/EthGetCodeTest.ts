import test from 'ava'
import { ClientProxyEthGetCode } from '../../../src/client/proxy/EthGetCode'
import { Address } from '../../../src/entities/Address'

const address = new Address('0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c')
const tag = 'latest'

test('exists', t => {
	t.truthy(ClientProxyEthGetCode)
})

test('can be instantiated', t => {
	new ClientProxyEthGetCode(address, tag)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthGetCode.module, 'proxy')
	t.is(ClientProxyEthGetCode.action, 'eth_getCode')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthGetCode(address, tag)
	const j = c.toJson()
	t.is(j.action, ClientProxyEthGetCode.action)
	t.is(j.module, ClientProxyEthGetCode.module)
	t.is(j.address, address.toString())
})

