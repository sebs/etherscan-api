import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, globSync } from 'node:fs';
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

// The CI workflow used to run `node --test test/*.test.js`, which matches only
// the top-level files and silently skipped every namespace directory — a green
// build over a fraction of the suite. CI must not run a narrower glob than the
// canonical `npm test`.
describe('CI runs the whole suite', function () {
  const canonical = globSync("test/**/*.test.js", { cwd: root }).length;
  const dir = new URL('../.github/workflows/', import.meta.url);
  const workflows = readdirSync(dir).filter((f) => /\.ya?ml$/.test(f));

  it('finds the workflow files', function () {
    assert.ok(workflows.length > 0);
  });

  for (const file of workflows) {
    const body = readFileSync(new URL(file, dir), 'utf8');
    const globs = [...body.matchAll(/node\s+--test\s+(\S+)/g)]
      .map((m) => m[1].replace(/^['"]|['"]$/g, ''));

    for (const glob of globs) {
      it(file + ' runs the full suite with `' + glob + '`', function () {
        const matched = globSync(glob, { cwd: root }).length;
        assert.equal(
          matched,
          canonical,
          `${file} runs ${matched} of ${canonical} test files; use \`npm test\``,
        );
      });
    }
  }
});
