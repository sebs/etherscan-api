import test from 'ava'

import { Network } from '../../src/entities/Network'

test('Instantiated', (t)=> {
	const name = 'rinkeby'
	const a = new Network(name)
	t.truthy(a)
})

test('rinkeby is valid', (t)=> {
	const name = 'rinkeby'
	const a = new Network(name)
	t.truthy(a.valid())
})

test('foo is invalid', (t)=> {
	const name = 'foo'
	const a = new Network(name)
	t.false(a.valid())
})

test('rinkeby is default', (t)=> {
	const a = new Network()
	t.is(a.toString(), 'homestead')
})

test('https://api.etherscan.io is the bas url for homestead', (t)=> {
	const a = new Network()
	t.is(a.toUrl(), 'https://api.etherscan.io')
})