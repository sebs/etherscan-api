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

		it('account/balance', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.account('balance')('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', 'latest')
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})


		it('account/balancemulti', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.account('balancemulti')([
				'0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
			], 'latest')
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})


		it('contract/getabi', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.contract('getabi')('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413')
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('contract/getsourcecode', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.contract('getsourcecode')('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413')
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('transaction/getstatus', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.transaction('getstatus')('0x513c1ba0bebf66436b5fed86ab668452b7805593c05073eb2d51d3a52f480a76')
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})
		it('transaction/gettxreceiptstatus', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.transaction('gettxreceiptstatus')('0x513c1ba0bebf66436b5fed86ab668452b7805593c05073eb2d51d3a52f480a76')
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})
})
