import test from 'ava'
import { ClientStatsEthsupply } from '../../../src/client/stats/Ethsupply'

test('exists', t => {
	t.truthy(ClientStatsEthsupply)
})

test('can be instantiated', t => {
	new ClientStatsEthsupply()
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientStatsEthsupply.module, 'stats')
	t.is(ClientStatsEthsupply.action, 'ethsupply')
})

test('creates the correct json', t => {
	const c = new ClientStatsEthsupply()
	const j = c.toJson()
	t.is(j.module, ClientStatsEthsupply.module)
	t.is(j.action, ClientStatsEthsupply.action)
})
