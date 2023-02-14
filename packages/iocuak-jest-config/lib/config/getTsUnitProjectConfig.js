import {
  tsIntegrationTestExtension,
  tsUnitTestExtension,
} from './extensions.js';
import getTsProjectConfig from './getTsProjectConfig.js';

/**
 * @param { !string } rootDir Jest project's root directory.
 * @returns { !import("@jest/types").Config.ProjectConfig } Jest config
 */
function getTsUnitProjectConfig(rootDir) {
  return getTsProjectConfig(
    rootDir,
    'Unit',
    [tsIntegrationTestExtension],
    tsUnitTestExtension,
  );
}

export default getTsUnitProjectConfig;
