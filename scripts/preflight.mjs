#!/usr/bin/env node
// Pre-push deploy verification — mirrors the CI pipeline in ci.yml
// Works on Windows, macOS, and Linux (Node >= 18)

import { spawnSync } from 'child_process';
import { existsSync } from 'fs';

const steps = [
  { name: 'Type-check', cmd: 'yarn test:types' },
  { name: 'Lint',       cmd: 'yarn lint:ci'    },
  { name: 'Unit tests', cmd: 'yarn test'        },
  { name: 'Build',      cmd: 'yarn build'       },
];

const isWindows = process.platform === 'win32';
const c = {
  cyan:  s => `\x1b[36m${s}\x1b[0m`,
  green: s => `\x1b[32m${s}\x1b[0m`,
  red:   s => `\x1b[31m${s}\x1b[0m`,
};

const run = cmd => spawnSync(
  isWindows ? 'cmd' : 'sh',
  isWindows ? ['/c', cmd] : ['-c', cmd],
  { stdio: 'inherit' }
);

const start = Date.now();
const passed = [];
let failed = null;

for (const step of steps) {
  console.log(`\n${c.cyan(`==> ${step.name}`)}`);
  const result = run(step.cmd);
  if (result.status !== 0) { failed = step.name; break; }
  passed.push(step.name);
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);

console.log('\n' + '─'.repeat(40));
for (const name of passed) console.log(c.green(`  PASS  ${name}`));

if (failed) {
  console.log(c.red(`  FAIL  ${failed}`));
  console.log(c.red(`\nPreflight failed after ${elapsed}s — fix the errors above before pushing.`));
  process.exit(1);
}

for (const p of ['dist']) {
  if (!existsSync(p)) {
    console.log(c.red(`  FAIL  Missing build output: ${p}`));
    process.exit(1);
  }
  console.log(c.green(`  OK    ${p} exists`));
}

console.log(c.green(`\nAll checks passed in ${elapsed}s — safe to push.`));
