import test from 'ava'
import { Paging } from '../../src/entities/Paging'
import { PositiveNumber } from '../../src/entities/PositiveNumber';

test('Instantiated', (t)=> {
	const page = new Paging()
	t.truthy(page)
})

test('default values', (t)=> {
	const page = new Paging()
	const res = page.toJson()
	t.is(res.page, '1')
	t.is(res.offset, '10')
})

test('page 2 offset 100', (t)=> {
	const page = new Paging(new PositiveNumber(2), new PositiveNumber(100))
	const res = page.toJson()
	t.is(res.page, '2')
	t.is(res.offset, '100')
})


