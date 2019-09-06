import test from 'ava'

import { Blockchain } from '../../src/entities/Blockchain'

test('Instantiated', (t)=> {
	const name = 'rinkeby'
	const a = new Blockchain(name)
	t.truthy(a)
})

test('rinkeby is valid', (t)=> {
	const name = 'rinkeby'
	const a = new Blockchain(name)
	t.truthy(a.valid())
})

test('foo is invalid', (t)=> {
	const name = 'foo'
	const a = new Blockchain(name)
	t.false(a.valid())
})

test('rinkeby is default', (t)=> {
	const a = new Blockchain()
	t.is(a.toString(), 'homestead')
})

test('https://api.etherscan.io is the bas url for homestead', (t)=> {
	const a = new Blockchain()
	t.is(a.toUrl(), 'https://api.etherscan.io')
})