import test from 'ava'

import { HexQuantity } from '../../src/entities/HexQuantity'

test('Instantiated', (t)=> {
	const hex = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
	const a = new HexQuantity(hex)
	t.truthy(a)
})

