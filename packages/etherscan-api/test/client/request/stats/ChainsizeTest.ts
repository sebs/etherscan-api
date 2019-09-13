import test from 'ava'
import { ClientStatsChainsize } from '../../../../src/client/stats/Chainsize'
import { UsDate } from '../../../../src/entities/UsDate'
import { Clienttype } from '../../../../src/entities/Clienttype'
import { Syncmode } from '../../../../src/entities/Syncmode'
import { Network } from '../../../../src/entities/Network'
import { performRequest } from '../../../../src/util/performRequest'
import { requestUrlBuilder } from '../../../../src/requestUrlBuilder'

const resultFixture = require('etherscan-api-test-fixtures/stats/chainsize/simple.json')

const fetch = require('isomorphic-fetch')
const nock = require('nock')
import { parse } from 'url'

const startdate = new UsDate('2019-02-01')
const enddate = new UsDate('2019-02-28')
const clienttype = new Clienttype('geth')
const syncmode = new Syncmode('default')


test('default', async t => {
	const c = new ClientStatsChainsize(
		startdate,
		enddate,
		clienttype,
		syncmode
	)
	const json = c.toJson()
	const network = new Network()
	const url = requestUrlBuilder(network, 'stats', 'chainsize', json)
	const parsedUrl = parse(url)

	const scope = nock(`${parsedUrl.protocol}//${parsedUrl.host}`)
		.get(parsedUrl.path)
		.reply(200, resultFixture)	

	await performRequest(network, 'stats', 'chainsize', json)
	scope.done()
	t.truthy(url)
})
