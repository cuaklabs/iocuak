import getJsIntegrationProjectConfig from './getJsIntegrationProjectConfig.js';
import getJsUnitProjectConfig from './getJsUnitProjectConfig.js';

/**
 * @param { !string } rootDir Jest project's root directory.
 * @returns { !import("@jest/types").Config.GlobalConfig } Jest config
 */
function getJsGlobalConfig(rootDir) {
  const jsUnitProject = getJsUnitProjectConfig(rootDir);
  const jsIntegrationProject = getJsIntegrationProjectConfig(rootDir);

  /** @type {!import("@jest/types").Config.GlobalConfig} */
  const jsGlobalConfig = {
    passWithNoTests: true,
    projects: [jsIntegrationProject, jsUnitProject],
  };

  return jsGlobalConfig;
}

export default getJsGlobalConfig;
