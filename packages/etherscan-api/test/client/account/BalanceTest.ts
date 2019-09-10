import test from 'ava'
import { ClientAccountBalance } from '../../../src/client/account/Balance'
import { Address } from '../../../src/entities/Address'

const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
const tag = 'latest'
const expectedUrl = 'https://api.etherscan.io/api?action=balance&module=account&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&apiKey=TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W&tag=latest'

test('exists', t => {
	t.truthy(ClientAccountBalance)
})

test('can be instantiated', t => {
	new ClientAccountBalance(new Address(address), tag)
	t.pass()
})

test('can be instantiated', t => {
	new ClientAccountBalance(new Address(address), tag)
	t.pass()
})

test('generates the right json', t => {
	const c = new ClientAccountBalance(new Address(address), tag)
	const json = c.toJson()
	t.is(json.action, ClientAccountBalance.action)
	t.is(json.module, ClientAccountBalance.module)
	t.is(json.address, address)
	t.is(json.tag, tag)
})


