import projectRoot from './projectRoot.js';

/**
 * @param { !string } rootDir Jest project's root directory.
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testMatch Expressions to match to test file paths
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @returns { !import("@jest/types").Config.ProjectConfig } Jest config
 */
function getProjectConfig(
  rootDir,
  projectName,
  testMatch,
  testPathIgnorePatterns,
) {
  /** @type { !import("@jest/types").Config.ProjectConfig } */
  const projectConfig = {
    displayName: projectName,
    coveragePathIgnorePatterns: [
      '/fixtures/',
      'index.js',
      '/mocks/',
      '/node_modules/',
    ],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir,
    roots: [projectRoot],
    testEnvironment: 'node',
    testMatch: testMatch,
    testPathIgnorePatterns: testPathIgnorePatterns,
  };

  return projectConfig;
}

export default getProjectConfig;
