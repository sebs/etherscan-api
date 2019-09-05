import test from 'ava'
import { Paging } from '../../src/entities/Paging'
import { AssertionError } from 'assert';

test('Instantiated', (t)=> {
	const page = new Paging()
	t.truthy(page)
})

test('default values', (t)=> {
	const page = new Paging()
	const res = page.toJson()
	t.is(res.page, '1')
	t.is(res.offset, '0')
})