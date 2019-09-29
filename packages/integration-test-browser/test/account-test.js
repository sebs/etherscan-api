'use strict'
const validApiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'
const assert = this.chai ? this.chai.assert : require('assert')
describe('client', function () {
	it('EtherscanClient global exists', function () {
		assert.ok(window.EtherscanClient)
	})
	it('can be instantated', function () {
		const client = new EtherscanClient.Client(validApiKey);
	})

	describe('account', ()=> {
		it('balance', function (done) {
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
		it('balancemulti', function (done) {
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
		it('txlist', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
			const startblock = 0
			const endblock = 99999999
			const sort = 'asc'
			const promise = client.account('txlist')(address, startblock, endblock, sort)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})	
		it('txlist paged', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
			const startblock = 0
			const endblock = 99999999
			const sort = 'asc'
			const promise = client.account('txlist')(address, startblock, endblock, sort, 1, 100)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})	
		it('txlistinternal', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const address = '0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3'
			const startblock = 0
			const endblock = 2702578
			const sort = 'asc'
			const promise = client.account('txlistinternal')(address, startblock, endblock, sort, 1, 100)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.status)
				assert.equal(res.status, 1)
				done()
			}).catch(err => {
				throw new Error(err)
			})

			it('txlistinternaltxhash', function (done) {
				this.retries(3)
				const client = new EtherscanClient.Client(validApiKey);
				const txhash = '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170'
				const startblock = 0
				const endblock = 999999
				const sort = 'asc'
				const promise = client.account('txlistinternaltxhash')(txhash, startblock, endblock, sort)
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
	})

	describe('contract', ()=> {
		it('getabi', function (done) {
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
		it('getsourcecode', function (done) {
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
	})
	describe('transaction', ()=> {
		it('getstatus', function (done) {
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
		it('gettxreceiptstatus', function (done) {
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

	describe('block', ()=> {
		it('getblockreward', function (done) {
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
	})


	describe('stats', ()=> {
		it('tokensupply', function (done) {
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
		it('chainsize', function (done) {
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

		it('ethprice', function (done) {
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

		it('ethsupply', function (done) {
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

	describe('proxy', () => {
		it('eth_Blocknumber', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const promise = client.proxy('eth_Blocknumber')()
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('eth_call', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);

			const to = '0xAEEF46DB4855E25702F8237E8f403FddcaF931C0'
			const data = '0x70a08231000000000000000000000000e16359506c028e51f16be38986ec5746251e9724'
			const tag = 'latest'

			const promise = client.proxy('eth_call')(to, data, tag)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('eth_estimateGas', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);

			const to = '0xf0160428a8552ac9bb7e050d90eeade4ddd52843'
			const value = '0xff22'
			const gasPrice = '0x051da038cc'

			const promise = client.proxy('eth_estimateGas')(to, value, gasPrice)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				// this call triggers an error in docs
				assert.ok(res.error)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('eth_gasPrice', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);

			const promise = client.proxy('eth_gasPrice')()
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('eth_getBlockTransactionCountByNumber', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const tag = '0x10FB78'
			const promise = client.proxy('eth_getBlockTransactionCountByNumber')(tag)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('eth_getCode', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const address = '0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c'
			const tag = 'latest'
			const promise = client.proxy('eth_getCode')(address, tag)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('eth_getStorageAt', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const address = '0x6e03d9cce9d60f3e9f2597e13cd4c54c55330cfd'
			const position = '0x0'
			const tag = 'latest'
			const promise = client.proxy('eth_getStorageAt')(address, position, tag)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('proxy/eth_getTransactionByBlockNumberAndIndex', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const index = '0x0'
			const tag = '0x10d4f'
			const promise = client.proxy('eth_getTransactionByBlockNumberAndIndex')(index, tag)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('eth_getTransactionByHash', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const txhash = '0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1'
			const promise = client.proxy('eth_getTransactionByHash')(txhash)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('eth_getTransactionCount', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const address = '0x2910543af39aba0cd09dbb2d50200b3e800a63d2'
			const tag = 'latest'
			const promise = client.proxy('eth_getTransactionCount')(address, tag)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('eth_getUncleByBlockNumberAndIndex', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const index = '0x0'
			const tag = '0x210A9B'
			const promise = client.proxy('eth_getUncleByBlockNumberAndIndex')(index, tag)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})

		it('eth_getBlockByNumber', function (done) {
			this.retries(3)
			const client = new EtherscanClient.Client(validApiKey);
			const tag = '0x10d4f'
			const promise = client.proxy('eth_getBlockByNumber')(tag, true)
			promise.then(res => {
				assert.ok(res)
				assert.ok(res.jsonrpc)
				assert.ok(res.result)
				done()
			}).catch(err => {
				throw new Error(err)
			})
		})
	})
})
