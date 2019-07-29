import test from 'ava'
import { requestBuilder } from '../src/requestBuilder'

test('builds a valid url', t => {
	const res = requestBuilder('account', 'balance')
	t.truthy(res)
})

test('containts https', t => {
	const res = requestBuilder('account', 'balance')
	t.regex(res, /https/)
})

test('containts /api', t => {
	const res = requestBuilder('account', 'balance')
	t.regex(res, /\/api/)
})

test('throws on unknown module', t => {
	t.throws(()=> requestBuilder('foomodulenotexist', 'balance'))
})
