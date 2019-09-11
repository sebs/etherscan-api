import test from 'ava'
import { ClientContractGetabi } from '../../../src/client/contract/Getabi'
import { Address } from '../../../src/entities/Address'

const address = new Address('0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413')

test('exists', t => {
	t.truthy(ClientContractGetabi)
})

test('can be instantiated', t => {
	new ClientContractGetabi(address)
	t.pass()
})
test('creates the correct json', t => {
	const c = new ClientContractGetabi(address)
	const j = c.toJson()
	t.is(j.module, ClientContractGetabi.module)
	t.is(j.action, ClientContractGetabi.action)
	t.is(j.address, address.toString())
})
