const assert = require('assert')

const Client = require('etherscan-api').Client
const validApiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'

describe('simple', ()=>{
	it('can be instantiated', ()=> {
		const client = new Client(validApiKey);
		assert.ok(client)
	})
})