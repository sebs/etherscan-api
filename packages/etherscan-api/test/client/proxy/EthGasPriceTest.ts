import test from 'ava'
import { ClientProxyEthGasPrice } from '../../../src/client/proxy/EthGasPrice'

const to = '0xf0160428a8552ac9bb7e050d90eeade4ddd52843'
const value = '0xff22'


test('exists', t => {
	t.truthy(ClientProxyEthGasPrice)
})

test('can be instantiated', t => {
	new ClientProxyEthGasPrice()
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthGasPrice.module, 'proxy')
	t.is(ClientProxyEthGasPrice.action, 'eth_gasPrice')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthGasPrice()
	const j = c.toJson()
	t.is(j.action, ClientProxyEthGasPrice.action)
	t.is(j.module, ClientProxyEthGasPrice.module)
})


