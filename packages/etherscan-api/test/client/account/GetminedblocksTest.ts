import test from 'ava'
import { ClientAccountGetminedblocks } from '../../../src/client/account/Getminedblocks'
import { Address } from '../../../src/entities/Address'

const type = 'block'
const address = new Address('0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b')
const tag = 'latest'

test('exists', t => {
	t.truthy(ClientAccountGetminedblocks)
})

test('can be instantiated', t => {
	new ClientAccountGetminedblocks(address, tag)
	t.pass()
})

test('genertates the right json', t => {
	const c = new ClientAccountGetminedblocks(address, tag)
	const j = c.toJson()
	t.is(j.module, ClientAccountGetminedblocks.module)
	t.is(j.action, ClientAccountGetminedblocks.action)
	t.is(j.address, address.toString())
})

