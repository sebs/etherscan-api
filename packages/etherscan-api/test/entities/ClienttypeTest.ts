import test from 'ava'
import { Clienttype } from '../../src/entities/Clienttype'


test('geth is valid', (t)=> {
	const a = new Clienttype('geth')
	t.truthy(a.valid())
})

test('parity is valid', (t)=> {
	const a = new Clienttype('parity')
	t.truthy(a.valid())
})

test('correct default', (t)=> {
	const a = new Clienttype()
	t.truthy(a.valid())
	t.is(a.toString(), 'geth')
})

test('foo is invalid', (t)=> {
	const bt = 'foo'
	const a = new Clienttype(bt)
	t.false(a.valid())
})
