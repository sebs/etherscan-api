import test from 'ava'
import { ClientLogGetLogs } from '../../../src/client/log/GetLogs'
import { Address } from '../../../src/entities/Address'
import { Operator } from '../../../src/entities/Operator'
import { PositiveNumber } from '../../../src/entities/PositiveNumber'
const address = new Address('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413')

test('exists', t => {
	t.truthy(ClientLogGetLogs)
})

test('can be instantiated', t => {
	// https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=379224&toBlock=400000&address=0x33990122638b9132ca29c723bdf037f1a891a70c&topic0=0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545&topic0_1_opr=and&topic1=0x72657075746174696f6e00000000000000000000000000000000000000000000&apikey=YourApiKeyToken
	const fromBlock = new PositiveNumber('379224')
	const toBlock = new PositiveNumber('400000')
	const address = new Address('0x33990122638b9132ca29c723bdf037f1a891a70c')
	new ClientLogGetLogs(
		fromBlock, 
		toBlock,
		address,
		[
			'0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545',
			'0x72657075746174696f6e00000000000000000000000000000000000000000000'
		],
		new Operator('and')
	)
	t.pass()
})

test('simple case generates the right json', t => {
	// https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=379224&toBlock=400000&address=0x33990122638b9132ca29c723bdf037f1a891a70c&topic0=0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545&topic0_1_opr=and&topic1=0x72657075746174696f6e00000000000000000000000000000000000000000000&apikey=YourApiKeyToken
	const fromBlock = new PositiveNumber('379224')
	const toBlock = new PositiveNumber('400000')
	const address = new Address('0x33990122638b9132ca29c723bdf037f1a891a70c')
	const c = new ClientLogGetLogs(
		fromBlock, 
		toBlock,
		address,
		[
			'0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545',
			'0x72657075746174696f6e00000000000000000000000000000000000000000000'
		],
		new Operator('and')
	)
	const j = c.toJson()
	t.is(j.fromBlock, fromBlock.toString())
	t.is(j.toBlock, toBlock.toString())
	t.is(j.address, address.toString())
	t.is(j.topic0, '0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545')
	t.is(j.topic1, '0x72657075746174696f6e00000000000000000000000000000000000000000000')
	t.is(j.topic0_1_opr, 'and')
})
