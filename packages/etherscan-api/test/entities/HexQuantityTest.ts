import test from 'ava'

import { HexQuantity } from '../../src/entities/HexQuantity'

test('Instantiated', (t)=> {
	const hex = '0x10FB78'
	const a = new HexQuantity(hex)
	t.truthy(a)
})

test.skip('valid', (t)=> {
	const hex = '10FB78'
	const a = new HexQuantity(hex)
	t.truthy(a.valid())
})

test('invalid', (t)=> {
	const hex = 'bar'
	const a = new HexQuantity(hex)
	t.falsy(a.valid())
})



