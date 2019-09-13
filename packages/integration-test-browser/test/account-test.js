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

		it('account/tokenbalance', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.account('tokenbalance')(
					'0xe04f27eb70e025b78871a2ad7eabe85e61212761', 
					'0x57d90b64a1a57749b0f932f1a3395792e12e7055'
				)
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
		it('block/getblockreward', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.block('getblockreward')('2165403')
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})
		it('stats/tokensupply', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.stats('tokensupply')('0x57d90b64a1a57749b0f932f1a3395792e12e7055')
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('stats/chainsize', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.stats('chainsize')(
				'2019-02-01',
				'2019-02-28',
				'geth',
				'default'
			)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})
		it('stats/ethprice', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.stats('ethprice')()
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})
		it('stats/ethsupply', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.stats('ethsupply')()
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
