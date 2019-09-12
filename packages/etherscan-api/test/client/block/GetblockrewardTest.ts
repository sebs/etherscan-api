import test from 'ava'
import { ClientBlockGetblockreward } from '../../../src/client/block/Getblockreward'
import { PositiveNumber } from '../../../src/entities/PositiveNumber'

const blockno = new PositiveNumber('2165403');

test('exists', t => {
	t.truthy(ClientBlockGetblockreward)
})

test('can be instantiated', t => {
	new ClientBlockGetblockreward(blockno)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientBlockGetblockreward.module, 'block')
	t.is(ClientBlockGetblockreward.action, 'getblockreward')
})

test('creates the correct json', t => {
	const c = new ClientBlockGetblockreward(blockno)
	const j = c.toJson()
	t.is(j.module, ClientBlockGetblockreward.module)
	t.is(j.action, ClientBlockGetblockreward.action)
	t.is(j.blockno, '2165403')
})
