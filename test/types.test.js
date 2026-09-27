import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Type-checks test-d/consumer.ts against the built declarations, so a
// regression in the public types fails the suite like any other test.
const require = createRequire(import.meta.url);
const tsc = require.resolve('typescript/bin/tsc');
const project = fileURLToPath(new URL('../test-d/tsconfig.json', import.meta.url));

describe('public types', function () {
  it('compile for a strict consumer (test-d/consumer.ts)', function () {
    try {
      execFileSync(process.execPath, [tsc, '-p', project], { encoding: 'utf8' });
    } catch (err) {
      assert.fail(err.stdout || err.message);
    }
  });
});
