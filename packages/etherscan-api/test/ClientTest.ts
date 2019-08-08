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
