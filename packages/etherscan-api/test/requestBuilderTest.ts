import test from 'ava'
import { requestBuilder } from '../src/requestBuilder'
import { Blockchain } from '../src/entities/Blockchain'

test('builds a valid url', t => {
	const res = requestBuilder(new Blockchain(), 'account', 'balance')
	t.truthy(res)
})

test('containts https', t => {
	const res = requestBuilder(new Blockchain(), 'account', 'balance')
	t.regex(res, /https/)
})

test('containts /api', t => {
	const res = requestBuilder(new Blockchain(), 'account', 'balance')
	t.regex(res, /\/api/)
})

test('contains additional parameters', t => {
	const res = requestBuilder(new Blockchain(), 'account', 'balance', {
		foo: 'bar'
	})
	t.regex(res, /foo/)
	t.regex(res, /bar/)
})

test('throws on unknown module', t => {
	t.throws(()=> requestBuilder(new Blockchain(), 'foomodulenotexist', 'balance'))
})

test('throws on unknown actions', t => {
	t.throws(()=> requestBuilder(new Blockchain(), 'account', 'idontknow'))
})
