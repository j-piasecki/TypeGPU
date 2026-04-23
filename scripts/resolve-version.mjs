#!/usr/bin/env node
// @ts-check

/**
 * version-getter-script for software-mansion/npm-package-publish.
 *
 * Echoes the version from the package's own package.json so versions stay
 * authored in-repo (via changesets / manual bumps) rather than inferred from
 * branch names. --version, if passed, takes precedence.
 */

import { readFileSync } from 'node:fs';
import { argv, exit, stdout, stderr } from 'node:process';

function getFlag(name) {
  const idx = argv.indexOf(name);
  return idx !== -1 && idx + 1 < argv.length ? argv[idx + 1] : undefined;
}

const pkgJsonPath = getFlag('--package-json-path');
if (!pkgJsonPath) {
  stderr.write('resolve-version: --package-json-path is required\n');
  exit(1);
}

const explicit = getFlag('--version');
if (explicit && explicit.length > 0) {
  stdout.write(`${explicit}\n`);
  exit(0);
}

const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
if (typeof pkg.version !== 'string' || pkg.version.length === 0) {
  stderr.write(`resolve-version: ${pkgJsonPath} has no version field\n`);
  exit(1);
}

stdout.write(`${pkg.version}\n`);
