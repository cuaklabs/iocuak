import { getBaseConfiguration } from './cucumber.config.base.mjs';

/**
 * @param {string | undefined} packageName
 * @returns { string }
 */
function getRequiredModulesPaths(packageName) {
  return `packages/${packageName ?? '*'}/lib/e2e/definitions/**/*.js`;
}

/**
 * @param {string | undefined} packageName
 * @param {boolean} parallel
 * @returns {!import("@cucumber/cucumber/lib/configuration").IConfiguration}
 */
function getConfiguration(packageName, parallel) {
  /** @type {!import("@cucumber/cucumber/lib/configuration").IConfiguration} */
  const config = {
    ...getBaseConfiguration(packageName, parallel),
    require: [getRequiredModulesPaths(packageName)],
  };

  return config;
}

/** @type {import("@cucumber/cucumber/lib/configuration").IConfiguration} */
const ci = getConfiguration(undefined, false);

/** @type {import("@cucumber/cucumber/lib/configuration").IConfiguration} */
const defaultCucumberConfig = getConfiguration(undefined, true);

export default defaultCucumberConfig;

export { ci };
