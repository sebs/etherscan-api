import test from 'ava'
import { Syncmode } from '../../src/entities/Syncmode'


test('default is valid', (t)=> {
	const a = new Syncmode('default')
	t.truthy(a.valid())
})

test('archive is valid', (t)=> {
	const a = new Syncmode('archive')
	t.truthy(a.valid())
})

test('correct default', (t)=> {
	const a = new Syncmode()
	t.truthy(a.valid())
	t.is(a.toString(), 'default')
})

test('foo is invalid', (t)=> {
	const bt = 'foo'
	const a = new Syncmode(bt)
	t.false(a.valid())
})
