import { getJestTsProjectConfig } from './jest.config.base.mjs';

/** @type {import("jest").Config} */
const tsProject = {
  ...getJestTsProjectConfig('All', ['/node_modules'], undefined, '.spec.ts'),
  rootDir: '../..',
  roots: ['./packages'],
};

export default tsProject;
