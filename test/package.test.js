import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Note: no fs.globSync here — it landed in Node 22 and package.json declares
// engines >=20, so this file has to run on Node 20 too.

const root = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));

/** Every *.test.js under test/, found without relying on glob support. */
function testFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return testFiles(full);
    return entry.name.endsWith('.test.js') ? [full] : [];
  });
}

describe('package.json test scripts', function () {
  const scripts = Object.entries(pkg.scripts || {})
    .filter(([, cmd]) => cmd.includes('node --test'));

  it('has at least one node --test script', function () {
    assert.ok(scripts.length > 0);
  });

  // `node --test <path>` with a path that does not exist still exits 0 on some
  // versions, reporting "tests 0" — a green run that tested nothing. That is
  // how the old test:live script (test/live/*.test.js, never created) passed.
  for (const [name, cmd] of scripts) {
    const args = cmd.slice(cmd.indexOf('node --test') + 'node --test'.length)
      .trim()
      .split(/\s+/)
      .filter((a) => a && !a.startsWith('-'))
      .map((a) => a.replace(/^['"]|['"]$/g, ''));

    for (const arg of args) {
      it('the path "' + arg + '" in script "' + name + '" holds test files', function () {
        // Take the literal directory prefix, i.e. everything before the first
        // segment containing a wildcard: test/live/*.test.js -> test/live.
        const prefix = arg
          .split('/')
          .slice(0, arg.split('/').findIndex((seg) => seg.includes('*')) === -1
            ? undefined
            : arg.split('/').findIndex((seg) => seg.includes('*')))
          .join('/') || '.';
        const full = path.join(root, prefix);
        assert.ok(existsSync(full), `"${name}" runs \`${cmd}\` but ${prefix} does not exist`);
        assert.ok(
          testFiles(full).length > 0,
          `"${name}" runs \`${cmd}\` but ${prefix} contains no *.test.js files`,
        );
      });
    }
  }
});

// The CI workflow used to run `node --test test/*.test.js`, whose shell-expanded
// glob matched only the top-level files and skipped every namespace directory —
// a green build over a fraction of the suite. CI must go through `npm test` so
// there is one definition of "the suite".
describe('CI runs the whole suite', function () {
  const dir = path.join(root, '.github', 'workflows');
  const workflows = readdirSync(dir).filter((f) => /\.ya?ml$/.test(f));

  it('finds the workflow files', function () {
    assert.ok(workflows.length > 0);
  });

  it('has test files to run', function () {
    assert.ok(testFiles(path.join(root, 'test')).length > 0);
  });

  for (const file of workflows) {
    it(file + ' does not hand-roll its own test invocation', function () {
      const body = readFileSync(path.join(dir, file), 'utf8');
      assert.ok(
        !/node\s+--test/.test(body),
        `${file} calls node --test directly; use \`npm test\` so CI and local runs agree`,
      );
    });
  }
});
