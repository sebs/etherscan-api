import test from 'ava'
import { Blocktype } from '../../src/entities/Blocktype'

test('uncle is correct', (t)=> {
	const bt = 'uncle'
	const a = new Blocktype(bt)
	t.truthy(a)
})

test('blocks is correct', (t)=> {
	const bt = 'blocks'
	const a = new Blocktype(bt)
	t.truthy(a)
})

test('foo is invalid', (t)=> {
	const bt = 'foo'
	const a = new Blocktype(bt)
	t.false(a.valid())
})
