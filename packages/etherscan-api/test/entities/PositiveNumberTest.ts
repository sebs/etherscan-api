import test from 'ava'

import { PositiveNumber } from '../../src/entities/PositiveNumber'


test('1 is valid', t => {
	const numerical = 1;
	const n = new PositiveNumber(numerical)
	t.truthy(n.valid())
})

test('0 is valid', t => {
	const numerical = 0;
	const n = new PositiveNumber(numerical)
	t.truthy(n.valid())
})

test('-1 is invalid', t => {
	const numerical = -1;
	const n = new PositiveNumber(numerical)
	t.falsy(n.valid())
})
