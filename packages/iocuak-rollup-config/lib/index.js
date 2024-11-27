import fs from 'node:fs/promises';

import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

import pathExists from './utils/pathExists.js';
import isNodeExportWarning from './utils/isNodeExportWarning.js';
import isTsLibRequiredWarning from './utils/isTsLibRequiredWarning.js';

const PACKAGE_JSON_PATH = './package.json';

if (!pathExists(PACKAGE_JSON_PATH)) {
  throw new Error(`Expected "${PACKAGE_JSON_PATH}" path to exist`);
}

const packageJsonObject = JSON.parse(await fs.readFile(PACKAGE_JSON_PATH));
const packageDependencies = Object.keys(packageJsonObject.dependencies ?? {});

/** @type {!import("rollup").MergedRollupOptions[]} */
export default [
  {
    input: './src/index.ts',
    external: packageDependencies,
    onwarn: (warning, defaultHandler) => {
      if (!isNodeExportWarning(warning) && !isTsLibRequiredWarning(warning)) {
        defaultHandler(warning);
      }
    },
    output: [
      {
        dir: './lib/esm',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [typescript()],
  },
  {
    input: 'lib/esm/index.d.ts',
    output: [{ file: 'lib/esm/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
