import {
  buildPackageJsProjects,
  getJestJsProjectConfig,
  getPackages,
} from './jest.config.base.mjs';

const packageProjects = getPackages().map(buildPackageJsProjects).flat();

const jsUnitProject = getJestJsProjectConfig(
  'Unit',
  ['/node_modules', '.int.spec.js'],
  undefined,
  '.spec.js',
);

const jsIntegrationProject = getJestJsProjectConfig(
  'Integration',
  ['/node_modules'],
  undefined,
  '.int.spec.js',
);

/** @type {!import("@jest/types/build/Config").GlobalConfig} */
const globalConfig = {
  collectCoverageFrom: [
    'packages/*/lib/**/*.js',
    '!packages/*/lib/**/*.spec.js',
  ],
  projects: [jsIntegrationProject, jsUnitProject, ...packageProjects],
};

export default globalConfig;
