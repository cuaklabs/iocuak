import getJestProjectConfig from './getJestProjectConfig.js';
import getTestMatch from './getTestMatch.js';

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { ?string } extension Test extension to match
 * @returns @returns { !import("jest").Config } Jest config
 */
function getJestTsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  extension,
) {
  const testMatch = [getTestMatch(extension, true)];

  return {
    ...getJestProjectConfig(projectName, testMatch, testPathIgnorePatterns),
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
  };
}

export default getJestTsProjectConfig;
