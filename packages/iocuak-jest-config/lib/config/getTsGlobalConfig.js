import getTsIntegrationProjectConfig from './getTsIntegrationProjectConfig.js';
import getTsUnitProjectConfig from './getTsUnitProjectConfig.js';

/**
 * @param { !string } rootDir Jest project's root directory.
 * @returns { !import("@jest/types").Config.GlobalConfig } Jest config
 */
function getTsGlobalConfig(rootDir) {
  const tsUnitProject = getTsUnitProjectConfig(rootDir);
  const tsIntegrationProject = getTsIntegrationProjectConfig(rootDir);

  /** @type {!import("@jest/types").Config.GlobalConfig} */
  const tsGlobalConfig = {
    passWithNoTests: true,
    projects: [tsIntegrationProject, tsUnitProject],
  };

  return tsGlobalConfig;
}

export default getTsGlobalConfig;
