import test from 'ava'

import { ApiKey } from '../../src/entities/Apikey'

test('Instantiated', (t)=> {
	const apiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
	const a = new ApiKey(apiKey)
	t.truthy(a)
})
