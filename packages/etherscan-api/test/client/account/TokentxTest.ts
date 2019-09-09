import test from 'ava'
import {ClientAccountTokentx } from '../../../src/client/account/Tokentx'
import { Address } from '../../../src/entities/Address'

const startblock = '0'
const endblock = '999999'


test('exists', t => {
	t.truthy(ClientAccountTokentx)
})


const address = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a'
test('can be instantiated', t => {
	const oAddress = new Address(address)
 new ClientAccountTokentx(oAddress, startblock, endblock)
 t.pass()
})


test('generates the right json', t => {
	const oAddress = new Address(address)
	const c = new ClientAccountTokentx(oAddress, startblock, endblock)
	const j = c.toJson()
	t.is(j.module, 'account')
	t.is(j.action, 'tokentx')
	t.is(j.address, oAddress.toString())
})