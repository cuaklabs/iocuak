import getJestProjectConfig from './getJestProjectConfig.js';
import getTestMatch from './getTestMatch.js';

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { ?string } extension Test extension to match
 * @returns { !import("jest").Config } Jest config
 */
function getJestJsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  extension,
) {
  const testMatch = [getTestMatch(extension, false)];

  return getJestProjectConfig(projectName, testMatch, testPathIgnorePatterns);
}

export default getJestJsProjectConfig;
