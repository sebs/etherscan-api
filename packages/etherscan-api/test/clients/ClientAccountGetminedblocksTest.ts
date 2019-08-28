import test from 'ava'
import { ClientAccountBalance } from '../../src/client/ClientAccountBalance'
// import { decode } from 'querystring'
// const nock = require('nock')
// import { parse } from 'url'
// import { readFile } from 'fs'
// import { promisify } from 'util'
//const _readFile = promisify(readFile)

test('exists', t => {
	t.truthy(ClientAccountBalance)
})