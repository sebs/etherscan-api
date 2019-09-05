'use strict'

const assert = this.chai ? this.chai.assert : require('assert')
	describe('document', function () {
			it('EtherscanClient global exists', function () {
				assert.ok(window.EtherscanClient)
			})
	})

