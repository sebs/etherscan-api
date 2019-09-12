import test from 'ava'
import { UsDate } from '../../src/entities/UsDate'

const usDate = '2019-02-01';

test('valid', (t)=> {
	const a = new UsDate(usDate)
	t.truthy(a.valid())
})

test('foo is invalid', (t)=> {
	const bt = 'foo'
	const a = new UsDate(bt)
	t.false(a.valid())
})
