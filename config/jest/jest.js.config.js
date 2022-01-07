const { getJestJsProjectConfig } = require('./jest.config.base');

const cuaktaskJsUnitProject = getJestJsProjectConfig(
  'Cuaktask-Unit',
  ['/node_modules', '.int.spec.js'],
  'cuaktask',
  '.spec.js',
);

const cuaktaskJsIntegrationProject = getJestJsProjectConfig(
  'Cuaktask-Integration',
  ['/node_modules'],
  'cuaktask',
  '.int.spec.js',
);

const iocuakJsUnitProject = getJestJsProjectConfig(
  'Iocuak-Unit',
  ['/node_modules', '.int.spec.js'],
  'iocuak',
  '.spec.js',
);

const iocuakJsIntegrationProject = getJestJsProjectConfig(
  'Iocuak-Integration',
  ['/node_modules'],
  'iocuak',
  '.int.spec.js',
);

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
  projects: [
    cuaktaskJsIntegrationProject,
    cuaktaskJsUnitProject,
    iocuakJsIntegrationProject,
    iocuakJsUnitProject,
    jsIntegrationProject,
    jsUnitProject,
  ],
};
