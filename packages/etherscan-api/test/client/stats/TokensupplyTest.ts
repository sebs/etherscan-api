import test from 'ava'
import { ClientStatsTokenupply } from '../../../src/client/stats/Tokensupply'
import { Address } from '../../../src/entities/Address'

const contractaddress = '0x57d90b64a1a57749b0f932f1a3395792e12e7055'

test('exists', t => {
	t.truthy(ClientStatsTokenupply)
})

test('can be instantiated', t => {
	new ClientStatsTokenupply(contractaddress)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientStatsTokenupply.module, 'stats')
	t.is(ClientStatsTokenupply.action, 'tokensupply')
})

test('creates the correct json', t => {
	const c = new ClientStatsTokenupply(contractaddress)
	const j = c.toJson()
	t.is(j.module, ClientStatsTokenupply.module)
	t.is(j.action, ClientStatsTokenupply.action)
	t.is(j.contractaddress, contractaddress.toString())
})
