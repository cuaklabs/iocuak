import os from 'os';

const cpuCores = os.cpus().length;

/**
 * @param {string | undefined} packageName
 * @returns { string }
 */
function getFeaturePaths(packageName) {
  return `packages/${packageName ?? '*'}/src/e2e/features/**/*.feature`;
}

/**
 * @param {string | undefined} packageName
 * @param {boolean} parallel
 * @returns {!import("@cucumber/cucumber/lib/configuration").IConfiguration}
 */
function getBaseConfiguration(packageName, parallel) {
  /** @type {!import("@cucumber/cucumber/lib/configuration").IConfiguration} */
  const config = {
    paths: [getFeaturePaths(packageName)],
    publishQuiet: true,
  };

  if (parallel === true) {
    config.parallel = cpuCores;
  }

  return config;
}

export { getBaseConfiguration };
