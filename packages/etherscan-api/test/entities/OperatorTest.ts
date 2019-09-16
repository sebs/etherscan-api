import test from 'ava'

import { Operator } from '../../src/entities/Operator'

test('Instantiated', (t)=> {
	const a = new Operator()
	t.truthy(a)
})

test('and is valid', (t)=> {
	const a = new Operator('and')
	t.truthy(a.valid())
})

test('or is valid', (t)=> {
	const a = new Operator('or')
	t.truthy(a.valid())
})

test('foo is invalid', (t)=> {
	const a = new Operator('foo')
	t.false(a.valid())
})
