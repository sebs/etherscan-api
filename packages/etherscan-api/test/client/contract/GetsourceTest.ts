import test from 'ava'
import { ClientContractGetsource } from '../../../src/client/contract/Getsource'
import { Address } from '../../../src/entities/Address'

const address = new Address('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413')

test('exists', t => {
	t.truthy(ClientContractGetsource)
})

test('can be instantiated', t => {
	new ClientContractGetsource(address)
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientContractGetsource.module, 'contract')
	t.is(ClientContractGetsource.action, 'getsourcecode')
})

test('creates the correct json', t => {
	const c = new ClientContractGetsource(address)
	const j = c.toJson()
	t.is(j.module, ClientContractGetsource.module)
	t.is(j.action, ClientContractGetsource.action)
	t.is(j.address, address.toString())
})
