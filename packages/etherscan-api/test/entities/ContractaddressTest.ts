import test from 'ava'
import { Contractaddress } from '../../src/entities/Contractaddress'


const contractAddress = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2';

test('valid', (t)=> {
	const a = new Contractaddress(contractAddress)
	t.truthy(a)
})


test('foo is invalid', (t)=> {
	const bt = 'foo'
	const a = new Contractaddress(bt)
	t.false(a.valid())
})
