import test from 'ava'
import { sort } from '../src/parameters/sort'
import { operand } from '../src/parameters/operand'

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
