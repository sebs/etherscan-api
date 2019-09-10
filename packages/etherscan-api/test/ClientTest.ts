import test from 'ava'
import { Client } from '../src/Client'
const pkg = require('../package.json')

test('constructor is a function', t => {
	t.is(typeof Client, 'function')
})

test('client can be instantiated', t =>  {
	t.notThrows(() => new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')) 
});

test('client can be instantiated', t =>  {
	t.notThrows(() => new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')) 
});

test('invalid api key throws', t =>  {
	t.throws(() => new Client('y')) 
});

test('account/balance is valid', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	client.account('balance')
	t.pass()
});

test('account/balancemulti is valid', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	client.account('balancemulti')
	t.pass()
});

test('account/tokentx is valid', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	client.account('tokentx')
	t.pass()
});

test('account/getminedblocks is valid', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	client.account('getminedblocks')
	t.pass()
});

test('account/txlist is valid', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	client.account('txlist')
	t.pass()
});

test('account/txlistinternal is valid', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	client.account('txlistinternal')
	t.pass()
});

test('account/txlistinternaltxhash is valid', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	client.account('txlistinternaltxhash')
	t.pass()
});

test('account api with invalid action throws', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	t.throws(() => client.account('unknown')) 
});

test('client has a static version property', t =>  {
	t.is(Client.version, pkg.version)
});

