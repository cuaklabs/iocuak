import { jsIntegrationTestExtension } from './extensions.js';
import getJsProjectConfig from './getJsProjectConfig.js';

/**
 * @param { !string } rootDir Jest project's root directory.
 * @returns { !import("@jest/types").Config.ProjectConfig } Jest config
 */
function getJsIntegrationProjectConfig(rootDir) {
  return getJsProjectConfig(
    rootDir,
    'Integration',
    [],
    jsIntegrationTestExtension,
  );
}

export default getJsIntegrationProjectConfig;
