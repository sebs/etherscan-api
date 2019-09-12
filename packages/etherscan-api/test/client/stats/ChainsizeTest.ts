import test from 'ava'
import { ClientStatsChainsize } from '../../../src/client/stats/Chainsize'
import { UsDate } from '../../../src/entities/UsDate';
import { Clienttype } from '../../../src/entities/Clienttype';
import { Syncmode } from '../../../src/entities/Syncmode';


const startdate = new UsDate('2019-02-01')
const enddate = new UsDate('2019-02-28')
const clienttype = new Clienttype('geth')
const syncmode = new Syncmode('default')


test('exists', t => {
	t.truthy(ClientStatsChainsize)
})

test('can be instantiated', t => {
	new ClientStatsChainsize(startdate, enddate, clienttype, syncmode)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientStatsChainsize.module, 'stats')
	t.is(ClientStatsChainsize.action, 'chainsize')
})

test('creates the correct json', t => {
	const c = new ClientStatsChainsize(startdate, enddate, clienttype, syncmode)
	const j = c.toJson()
	t.is(j.module, ClientStatsChainsize.module)
	t.is(j.action, ClientStatsChainsize.action)
	t.is(j.clienttype, 'geth')
	t.is(j.syncmode, 'default')
	t.is(j.startdate, '2019-02-01')
	t.is(j.enddate, '2019-02-28')
})
