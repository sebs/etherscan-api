import test from 'ava'
import { requestBuilder } from '../src/requestBuilder'
import { Network } from '../src/entities/Network'

test('builds a valid url', t => {
	const res = requestBuilder(new Network(), 'account', 'balance')
	t.truthy(res)
})

test('containts https', t => {
	const res = requestBuilder(new Network(), 'account', 'balance')
	t.regex(res, /https/)
})

test('containts /api', t => {
	const res = requestBuilder(new Network(), 'account', 'balance')
	t.regex(res, /\/api/)
})

test('contains additional parameters', t => {
	const res = requestBuilder(new Network(), 'account', 'balance', {
		foo: 'bar'
	})
	t.regex(res, /foo/)
	t.regex(res, /bar/)
})

test('throws on unknown module', t => {
	t.throws(()=> requestBuilder(new Network(), 'foomodulenotexist', 'balance'))
})

test('throws on unknown actions', t => {
	t.throws(()=> requestBuilder(new Network(), 'account', 'idontknow'))
})
