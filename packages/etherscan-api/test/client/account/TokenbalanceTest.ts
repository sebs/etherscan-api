import test from 'ava'
import { ClientAccountTokenbalance } from '../../../src/client/account/Tokenbalance'
import { Address } from '../../../src/entities/Address'

const address = '0x57d90b64a1a57749b0f932f1a3395792e12e7055'
const contractaddress = '0xe04f27eb70e025b78871a2ad7eabe85e61212761'

test('exists', t => {
	t.truthy(ClientAccountTokenbalance)
})

test('can be instantiated', t => {
	new ClientAccountTokenbalance(new Address(address), new Address(contractaddress))
	t.pass()
})

test('static properties are correct', t => {
	t.is(ClientAccountTokenbalance.module, 'account')
	t.is(ClientAccountTokenbalance.action, 'tokenbalance')
})

test('generates the right json', t => {
	const c = new ClientAccountTokenbalance(new Address(address), new Address(contractaddress))
	const json = c.toJson()
	t.is(json.action, ClientAccountTokenbalance.action)
	t.is(json.module, ClientAccountTokenbalance.module)
	t.is(json.address, address)
})


