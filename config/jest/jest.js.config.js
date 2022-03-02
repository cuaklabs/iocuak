const {
  buildPackageJsProjects,
  getJestJsProjectConfig,
  getPackages,
} = require('./jest.config.base');

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

module.exports = {
  projects: [jsIntegrationProject, jsUnitProject, ...packageProjects],
};
