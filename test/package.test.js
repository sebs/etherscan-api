import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// A `node --test <glob>` script whose glob matches nothing still exits 0 and
// reports "tests 0" — a green run that tested nothing. Guard against that.
describe('package.json test scripts', function () {
  const scripts = Object.entries(pkg.scripts || {})
    .filter(([, cmd]) => cmd.includes('node --test'));

  it('has at least one node --test script', function () {
    assert.ok(scripts.length > 0);
  });

  for (const [name, cmd] of scripts) {
    it('the glob in "' + name + '" matches at least one file', function () {
      const glob = cmd.split(/\s+/).pop().replace(/^['"]|['"]$/g, '');
      const matches = globSync(glob, { cwd: root });
      assert.ok(matches.length > 0, `"${name}" runs \`${cmd}\` but ${glob} matches no files`);
    });
  }
});
