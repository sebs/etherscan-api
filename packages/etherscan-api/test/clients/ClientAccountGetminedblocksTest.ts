import test from 'ava'
import { ClientAccountGetminedblocks } from '../../src/client/ClientAccountGetminedblocks'
import { ApiKey } from '../../src/entities/Apikey';
// import { decode } from 'querystring'
// const nock = require('nock')
// import { parse } from 'url'
// import { readFile } from 'fs'
// import { promisify } from 'util'
//const _readFile = promisify(readFile)

const type = 'block'
const apiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'

test('exists', t => {
	t.truthy(ClientAccountGetminedblocks)
})

test('can be instantiated', t => {
	const oApiKey = new ApiKey(apiKey)
	t.pass()
 })