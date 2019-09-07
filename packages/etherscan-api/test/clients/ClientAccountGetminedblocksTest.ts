import test from 'ava'
import { ClientAccountGetminedblocks } from '../../src/client/ClientAccountGetminedblocks'
import { ApiKey } from '../../src/entities/Apikey';
import { Address } from '../../src/entities/Address';
import { parse } from 'url'

const type = 'block'
const address = new Address('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b')
const tag = 'latest'
const apiKey = new ApiKey('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
const expectedUrl = 'https://api.etherscan.io/api?module=account&action=getminedblocks&address=0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b&blocktype=blocks&page=1&offset=10&apikey=TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'

test('exists', t => {
	t.truthy(ClientAccountGetminedblocks)
})

test('can be instantiated', t => {
	new ClientAccountGetminedblocks(apiKey, address, tag)
	t.pass()
})

test('generates the right url', t => {
	const c = new ClientAccountGetminedblocks(apiKey, address, tag)
	const url = c.toUrl()
	const parsedUrl = parse(url, true).query
	const parsedExpectedUrl = parse(expectedUrl, true).query
	t.is(parsedUrl.action, parsedExpectedUrl.action)
	t.is(parsedUrl.module, parsedExpectedUrl.module)
	t.is(parsedUrl.address, parsedExpectedUrl.address)
	t.is(parsedUrl.tag, parsedExpectedUrl.tag)
})

test('set paging generates the right parameters in the url', t => {
	const c = new ClientAccountGetminedblocks(apiKey, address, tag)
	c.setPaging('10', '100')
	const url = c.toUrl()
	const parsedUrl = parse(url, true).query
	const parsedExpectedUrl = parse(expectedUrl, true).query
	t.is(parsedUrl.page,'10')
	t.is(parsedUrl.offset, '100')
})


