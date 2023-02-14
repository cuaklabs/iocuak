import { getTsProjectConfig } from '@cuaklabs/iocuak-jest-config';

const tsGlobalConfig = getTsProjectConfig(
  './src',
  'All',
  ['/node_modules'],
  '.spec.ts',
);

export default tsGlobalConfig;
