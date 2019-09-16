import test from 'ava'
import { ClientProxyEthCall } from '../../../src/client/proxy/EthCall'
const to = '0xAEEF46DB4855E25702F8237E8f403FddcaF931C0'
const data = '0x70a08231000000000000000000000000e16359506c028e51f16be38986ec5746251e9724'
const tag = 'latest'

test('exists', t => {
	t.truthy(ClientProxyEthCall)
})

test('can be instantiated', t => {
	new ClientProxyEthCall(to, data, tag)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientProxyEthCall.module, 'proxy')
	t.is(ClientProxyEthCall.action, 'eth_call')
})

test('simple case generates the right json', t => {
	const c = new ClientProxyEthCall(to, data, tag)
	const j = c.toJson()
	t.is(j.action, ClientProxyEthCall.action)
	t.is(j.module, ClientProxyEthCall.module)
	t.is(j.to, to)
	t.is(j.data, data)
	t.is(j.tag, tag)
})
