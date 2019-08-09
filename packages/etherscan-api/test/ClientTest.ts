import test from 'ava'
import { Client } from '../src/Client'

test('constructor is a function', t => {
	t.is(typeof Client, 'function')
})

test('client can be instantiated', t =>  {
	t.notThrows(() => new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')) 
});

test('invalid api key throws', t =>  {
	t.throws(() => new Client('y')) 
});

test('account api with valid action', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	client.account('balance')
	t.pass()
});

test('account api with invalid action throws', t =>  {
	const client = new Client('TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W')
	t.throws(() => client.account('unknown')) 
});
