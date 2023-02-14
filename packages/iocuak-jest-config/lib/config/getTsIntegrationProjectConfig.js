import { tsIntegrationTestExtension } from './extensions.js';
import getTsProjectConfig from './getTsProjectConfig.js';

/**
 * @param { !string } rootDir Jest project's root directory.
 * @returns { !import("@jest/types").Config.ProjectConfig } Jest config
 */
function getTsIntegrationProjectConfig(rootDir) {
  return getTsProjectConfig(
    rootDir,
    'Integration',
    [],
    tsIntegrationTestExtension,
  );
}

export default getTsIntegrationProjectConfig;
