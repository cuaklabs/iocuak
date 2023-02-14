import getProjectConfig from './getProjectConfig.js';
import getTestMatch from './getTestMatch.js';

/**
 * @param { !string } rootDir Jest project's root directory.
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { ?string } extension Test extension to match
 * @returns { !import("@jest/types").Config.ProjectConfig } Jest config
 */
function getTsProjectConfig(
  rootDir,
  projectName,
  testPathIgnorePatterns,
  extension,
) {
  const testMatch = [getTestMatch(extension)];

  return {
    ...getProjectConfig(
      rootDir,
      projectName,
      testMatch,
      testPathIgnorePatterns,
    ),
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
  };
}

export default getTsProjectConfig;
