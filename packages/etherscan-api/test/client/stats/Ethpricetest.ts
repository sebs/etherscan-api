import test from 'ava'
import { ClientStatsEthprice } from '../../../src/client/stats/Ethprice'

test('exists', t => {
	t.truthy(ClientStatsEthprice)
})

test('can be instantiated', t => {
	new ClientStatsEthprice()
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientStatsEthprice.module, 'stats')
	t.is(ClientStatsEthprice.action, 'ethprice')
})

test('creates the correct json', t => {
	const c = new ClientStatsEthprice()
	const j = c.toJson()
	t.is(j.module, ClientStatsEthprice.module)
	t.is(j.action, ClientStatsEthprice.action)
})
