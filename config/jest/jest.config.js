const {
  buildPackageTsProjects,
  getJestTsProjectConfig,
  getPackages,
} = require('./jest.config.base');

const packageProjects = getPackages().map(buildPackageTsProjects).flat();

const tsUnitProject = getJestTsProjectConfig(
  'Unit',
  ['/node_modules', '.int.spec.ts'],
  undefined,
  '.spec.ts',
);

const tsIntegrationProject = getJestTsProjectConfig(
  'Integration',
  ['/node_modules'],
  undefined,
  '.int.spec.ts',
);

module.exports = {
  projects: [tsIntegrationProject, tsUnitProject, ...packageProjects],
};
