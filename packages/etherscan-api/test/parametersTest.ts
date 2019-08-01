import test from 'ava'
import { sort } from '../src/parameters/sort'


test('sort asc exists', t => {
	t.truthy(sort.asc)
})

test('sort asc can be compared to a string', t => {
	t.is(sort.asc, 'asc')
})


