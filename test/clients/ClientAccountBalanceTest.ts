import test from 'ava'
import { Client } from '../../src/Client'
import { parse } from 'url'
import { decode } from 'querystring'

test('account api with valid action', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	client.account('balance')
	t.pass()
})

test('account api with valid action', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	const res = client.account('balance')
	t.is(typeof res, 'function')
})

test('executing the function', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	const concreteClient = client.account('balance')('address', 'latest')
	t.truthy(concreteClient)
})


test('no param translates to [object Object]', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	const url = client.account('balance')('address', 'latest').toUrl()
	const parsedQuery = decode(url)
	t.not(parsedQuery.apiKey, '[object Object]')
	t.not(parsedQuery.module, '[object Object]')
	t.not(parsedQuery.account, '[object Object]')
	t.not(parsedQuery.address, '[object Object]')
})



test('the correct url is generated', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	const resultingUrl = 'https://api.etherscan.io/api?action=balance&module=account&address=address&tag=latest&apiKey=TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
	const url = client.account('balance')('address', 'latest').toUrl()
	t.is(url, resultingUrl)
})