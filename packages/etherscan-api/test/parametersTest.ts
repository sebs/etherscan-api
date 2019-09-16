import test from 'ava'
import { sort } from '../src/parameters/sort'
import { operand } from '../src/parameters/operand'
import { blocktypes } from '../src/parameters/blocktypes'
import { booleans } from '../src/parameters/booleans'
test('sort asc exists', t => {
	t.truthy(sort.asc)
})

test('sort asc can be compared to a string', t => {
	t.is(sort.asc, 'asc')
})

test('operand and', t => {
	t.is(operand.and, 'and')
})

test('operand or', t => {
	t.is(operand.or, 'or')
})

test('blocktypes blocks', t => {
	t.is(blocktypes.blocks, 'blocks')
})

test('blocktypes uncles', t => {
	t.is(blocktypes.uncles, 'uncles')
})

test('booleans true', t => {
	t.is(booleans.true, 'true')
})

test('booleans true', t => {
	t.is(booleans.false, 'false')
})
