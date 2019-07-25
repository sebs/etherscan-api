import test from 'ava'
import { account } from '../src/actions/account'
import { block } from '../src/actions/block'
import { contract } from '../src/actions/contract'
import { proxy } from '../src/actions/proxy'
import { stats } from '../src/actions/stats'
import { tokens } from '../src/actions/tokens' 
import { transaction } from '../src/actions/transaction'


test('account has the right amount of modules', t => {
  t.is(account.size, 6)
})

test('block has the right amount of modules', t => {
  t.is(block.size, 1)
})

test('contract has the right amount of modules', t => {
  t.is(contract.size, 2)
})

test('proxy has the right amount of modules', t => {
  t.is(proxy.size, 14)
})

test('stats has the right amount of modules', t => {
  t.is(stats.size, 2)
})

test('tokens has the right amount of modules', t => {
  t.is(tokens.size, 2)
})

test('transaction has the right amount of modules', t => {
  t.is(transaction.size, 2)
})