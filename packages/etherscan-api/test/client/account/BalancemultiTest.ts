import test from 'ava'
import { ClientAccountBalancemulti } from '../../../src/client/account/Balancemulti'
import { Address } from '../../../src/entities/Address'

const address = [ 
	'0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
	'0x63a9975ba31b0b9626b34300f7f627147df1f526',
	'0x198ef1ec325a96cc354c7266a038be8b5c558f67'
]


const tag = 'latest'
const expectedUrl = 'https://api.etherscan.io/api?action=balancemulti&module=account&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a,0x63a9975ba31b0b9626b34300f7f627147df1f526,0x198ef1ec325a96cc354c7266a038be8b5c558f67&tag=latest&apikey=YourApiKeyToken'
test('exists', t => {
	t.truthy(ClientAccountBalancemulti)
})

test('can be instantiated', t => {
	const arrAddress = address.map(a =>  new Address(a))
	new ClientAccountBalancemulti(arrAddress, tag)
	t.pass()
})

test('throws an error if there are more than 20 ', t => {
	const toManyAddress = Array.from({length: 21}, () => '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a');
	const arrAddress = toManyAddress.map(a =>  new Address(a))
	t.throws(() => new ClientAccountBalancemulti(arrAddress, tag)) 
})

test('throws an error if there are zero entries', t => {
	t.throws(() => new ClientAccountBalancemulti([], tag)) 
})

test('creates the correct json', t => {
	const arrAddress = address.map(a =>  new Address(a))
	const c = new ClientAccountBalancemulti(arrAddress, tag)
	const j = c.toJson()
	t.is(j.module, ClientAccountBalancemulti.module)
	t.is(j.action, ClientAccountBalancemulti.action)
	t.is(j.address[0], address[0])
	t.is(j.address[1], address[1])
	t.is(j.address[2], address[2])
	t.is(j.tag, 'latest')
})



