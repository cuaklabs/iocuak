#!/usr/bin/env node

import { argv } from 'node:process';
import { promisifiedExec } from '../src/promisifiedExec.js';

const baseRef = argv[2];

const stringifiedPackages = (
  await promisifiedExec(
    `pnpm exec nx print-affected --base=${baseRef} --head=HEAD --select=projects`,
  )
).trim();

/** @type {Array.<string>} */
let packageNames;

if (stringifiedPackages.length === 0) {
  packageNames = [];
} else {
  packageNames = stringifiedPackages
    .split(',')
    .map((packageName) => packageName.trim());
}

console.log(JSON.stringify(packageNames));
