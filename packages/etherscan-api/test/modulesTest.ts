import test from 'ava'
import { modules } from '../src/modules'

test('has the right amount of modules', t => {
  t.is(modules.size, 7)
})