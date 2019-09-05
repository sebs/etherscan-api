import test from 'ava'
import { Paging } from '../../src/entities/Paging'
import { AssertionError } from 'assert';

test('Instantiated', (t)=> {
	const page = new Paging()
	t.truthy(page)
})