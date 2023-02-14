import {
  jsIntegrationTestExtension,
  jsUnitTestExtension,
} from './extensions.js';
import getJsProjectConfig from './getJsProjectConfig.js';

/**
 * @param { !string } rootDir Jest project's root directory.
 * @returns { !import("@jest/types").Config.ProjectConfig } Jest config
 */
function getJsUnitProjectConfig(rootDir) {
  return getJsProjectConfig(
    rootDir,
    'Unit',
    [jsIntegrationTestExtension],
    jsUnitTestExtension,
  );
}

export default getJsUnitProjectConfig;
