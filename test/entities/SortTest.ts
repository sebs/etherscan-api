import test from 'ava'
import { Sort } from '../../src/entities/Sort'

test('asc is ok', (t)=> {
	const apiKey = 'asc'
	const a = new Sort(apiKey)
	t.truthy(a.valid())
})

test('desc is ok', (t)=> {
	const apiKey = 'desc'
	const a = new Sort(apiKey)
	t.truthy(a.valid())
})

test('foo false', (t)=> {
	const apiKey = 'foo'
	const a = new Sort(apiKey)
	t.falsy(a.valid())
})
