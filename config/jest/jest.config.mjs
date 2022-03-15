import {
  buildPackageTsProjects,
  getJestTsProjectConfig,
  getPackages,
} from './jest.config.base.mjs';

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

export default {
  projects: [tsIntegrationProject, tsUnitProject, ...packageProjects],
};
