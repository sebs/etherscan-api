import test from 'ava'
import { requestUrlBuilder } from '../src/requestUrlBuilder'
import { Network } from '../src/entities/Network'
import { parse } from 'querystring'

test('builds a valid url', t => {
	const res = requestUrlBuilder(new Network(), 'account', 'balance')
	t.truthy(res)
})

test('containts https', t => {
	const res = requestUrlBuilder(new Network(), 'account', 'balance')
	t.regex(res, /https/)
})

test('containts /api', t => {
	const res = requestUrlBuilder(new Network(), 'account', 'balance')
	t.regex(res, /\/api/)
})

test('contains additional parameters', t => {
	const url = requestUrlBuilder(new Network(), 'account', 'balance', {
		foo: 'bar'
	})

	const parsed = parse(url.split('?')[1])
	console.log(parsed)
	t.pass()
})

test('throws on unknown module', t => {
	t.throws(()=> requestUrlBuilder(new Network(), 'foomodulenotexist', 'balance'))
})

test('throws on unknown actions', t => {
	t.throws(()=> requestUrlBuilder(new Network(), 'account', 'idontknow'))
})
