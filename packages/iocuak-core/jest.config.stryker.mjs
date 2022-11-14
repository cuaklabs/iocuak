import { getJestTsProjectConfig } from '@cuaklabs/iocuak-jest-config';

const tsGlobalConfig = getJestTsProjectConfig(
  'All',
  ['/node_modules'],
  '.spec.ts',
);

export default tsGlobalConfig;
