import test from 'ava'

import { ApiKey } from '../../src/entities/Apikey'

test('Instantiated', (t)=> {
	const apiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
	const a = new ApiKey(apiKey)
	t.truthy(a)
})

test('key TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W is valid', (t)=> {
	const apiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
	const a = new ApiKey(apiKey)
	t.truthy(a.valid())
})

test('foo is valid', (t)=> {
	const apiKey = 'foo'
	const a = new ApiKey(apiKey)
	t.false(a.valid())
})



