import test from 'ava'
import { ClientProxyEthGetStorageAt } from '../../../src/client/proxy/EthGetStorageAt'
import { Address } from '../../../src/entities/Address'

const address = new Address('0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c')
const tag = 'latest'
const position = '0x0'
test('exists', t => {
	t.truthy(ClientProxyEthGetStorageAt)
})

test('can be instantiated', t => {
	new ClientProxyEthGetStorageAt(address, position, tag)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthGetStorageAt.module, 'proxy')
	t.is(ClientProxyEthGetStorageAt.action, 'eth_getStorageAt')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthGetStorageAt(address, position, tag)
	const j = c.toJson()
	t.is(j.action, ClientProxyEthGetStorageAt.action)
	t.is(j.module, ClientProxyEthGetStorageAt.module)
	t.is(j.address, address.toString())
	t.is(j.tag, tag)
})

