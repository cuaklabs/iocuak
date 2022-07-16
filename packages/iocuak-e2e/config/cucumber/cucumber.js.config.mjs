import { getBaseConfiguration } from './cucumber.config.base.mjs';

/**
 * @param {boolean} parallel
 * @returns {!import("@cucumber/cucumber/lib/configuration").IConfiguration}
 */
function getConfiguration(parallel) {
  /** @type {!import("@cucumber/cucumber/lib/configuration").IConfiguration} */
  const config = {
    ...getBaseConfiguration(parallel),
    require: ['lib/definitions/**/*.js'],
  };

  return config;
}

/** @type {import("@cucumber/cucumber/lib/configuration").IConfiguration} */
const ci = getConfiguration(false);

/** @type {import("@cucumber/cucumber/lib/configuration").IConfiguration} */
const defaultCucumberConfig = getConfiguration(true);

export default defaultCucumberConfig;

export { ci };
