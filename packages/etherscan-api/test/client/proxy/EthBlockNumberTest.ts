import test from 'ava'
import { ClientProxyEthBlocknumber } from '../../../src/client/proxy/EthBlocknumber'

test('exists', t => {
	t.truthy(ClientProxyEthBlocknumber)
})

test('can be instantiated', t => {
	new ClientProxyEthBlocknumber()
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthBlocknumber.module, 'proxy')
	t.is(ClientProxyEthBlocknumber.action, 'eth_Blocknumber')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthBlocknumber()
	const j = c.toJson()
	t.is(j.action, ClientProxyEthBlocknumber.action)
	t.is(j.module, ClientProxyEthBlocknumber.module)
})

