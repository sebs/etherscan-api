import test from 'ava'

import { Address } from '../../src/entities/Address'

test('Instantiated', (t)=> {
	const address = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a'
	const a = new Address(address)
	t.truthy(a)
})


test('valid address is valid', (t)=> {
	const address = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a'
	const a = new Address(address)
	t.truthy(a.valid())
})


test('invalid address is invalid', (t)=> {
	const address = 'dbd2b932c763ba5b1b7ae3b362eac3e8d40121a'
	const a = new Address(address)
	t.false(a.valid())
})








