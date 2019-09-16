import test from 'ava'
import { ClientProxyEthEstimateGas } from '../../../src/client/proxy/EthEstimateGas'

const to = '0xf0160428a8552ac9bb7e050d90eeade4ddd52843'
const value = '0xff22'


test('exists', t => {
	t.truthy(ClientProxyEthEstimateGas)
})

test('can be instantiated', t => {
	new ClientProxyEthEstimateGas(to, value)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthEstimateGas.module, 'proxy')
	t.is(ClientProxyEthEstimateGas.action, 'eth_estimateGas')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthEstimateGas(to, value)
	const j = c.toJson()
	t.is(j.action, ClientProxyEthEstimateGas.action)
	t.is(j.module, ClientProxyEthEstimateGas.module)
	t.is(j.to, to)
	t.is(j.value, value)
})

