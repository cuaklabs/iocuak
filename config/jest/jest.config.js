const { getJestTsProjectConfig } = require('./jest.config.base');

const cuaktaskTsUnitProject = getJestTsProjectConfig(
  'Cuaktask-Unit',
  ['/node_modules', '.int.spec.ts'],
  'cuaktask',
  '.spec.ts',
);

const cuaktaskTsIntegrationProject = getJestTsProjectConfig(
  'Cuaktask-Integration',
  ['/node_modules'],
  'cuaktask',
  '.int.spec.ts',
);

const iocuakTsUnitProject = getJestTsProjectConfig(
  'Iocuak-Unit',
  ['/node_modules', '.int.spec.ts'],
  'iocuak',
  '.spec.ts',
);

const iocuakTsIntegrationProject = getJestTsProjectConfig(
  'Iocuak-Integration',
  ['/node_modules'],
  'iocuak',
  '.int.spec.ts',
);

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
  projects: [
    cuaktaskTsIntegrationProject,
    cuaktaskTsUnitProject,
    iocuakTsUnitProject,
    iocuakTsIntegrationProject,
    tsIntegrationProject,
    tsUnitProject,
  ],
};
