'use strict'
const validApiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
const assert = this.chai ? this.chai.assert : require('assert')
	describe('document', function () {
			it('EtherscanClient global exists', function () {
				assert.ok(window.EtherscanClient)
			})

			it('can be instantated', function () {
				const client = new EtherscanClient.Client(validApiKey);
			})

			it('can make a call to an actual api', function (done) {
				const client = new EtherscanClient.Client(validApiKey);
				const promise = client.account('balance')('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', 'latest')
				promise.then(res => {
					assert.ok(res) 
					done()
				}).catch(err => {
					throw new Error('Err')
				})
		
			})
	})

