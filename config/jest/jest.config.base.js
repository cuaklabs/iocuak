const tsRoot = '<rootDir>/packages';
const jsRoot = '<rootDir>/dist';

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } collectCoverageFrom expressions to match to a file covered by IstambulJs
 * @param { !Array<string> } roots Jest roots
 * @param { !Array<string> } testMatch Expressions to match to test file paths
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @returns { !import("@jest/types/build/Config").GlobalConfig } Jest config
 */
function getJestProjectConfig(
  projectName,
  collectCoverageFrom,
  roots,
  testMatch,
  testPathIgnorePatterns,
) {
  const projectConfig = {
    displayName: projectName,
    collectCoverageFrom: collectCoverageFrom,
    coveragePathIgnorePatterns: ['/node_modules/', '/fixtures/'],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: '.',
    roots: roots,
    testEnvironment: 'node',
    testMatch: testMatch,
    testPathIgnorePatterns: testPathIgnorePatterns,
  };

  return projectConfig;
}

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { ?string } package Project package
 * @param { ?string } extension Test extension to match
 * @returns @returns { !import("@jest/types/build/Config").GlobalConfig } Jest config
 */
function getJestJsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  package,
  extension,
) {
  const testMatch = [getJsTestMatch(package, extension)];
  const collectCoverageFrom = [`${getJestJsProjectRoot(package)}/**/*.js`];

  return getJestProjectConfig(
    projectName,
    collectCoverageFrom,
    [getJestJsProjectRoot(package)],
    testMatch,
    testPathIgnorePatterns,
  );
}

/**
 * @param { ?string } package Project package
 * @returns { !string }
 */
function getJestJsProjectRoot(package) {
  return getJestProjectRoot(jsRoot, package);
}

/**
 * @param { !string } package Project root
 * @param { ?string } package Project package
 * @returns { !string }
 */
function getJestProjectRoot(root, submodule) {
  let projectRoots;

  if (submodule === undefined) {
    projectRoots = root;
  } else {
    projectRoots = `${root}/${submodule}`;
  }

  return projectRoots;
}

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { ?string } package Project package
 * @param { ?string } extension Test extension to match
 * @returns @returns { !import("@jest/types/build/Config").GlobalConfig } Jest config
 */
function getJestTsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  submodule,
  extension,
) {
  const testMatch = [getTsTestMatch(submodule, extension)];
  const collectCoverageFrom = [`${getJestTsProjectRoot(submodule)}/**/*.ts`];

  return {
    ...getJestProjectConfig(
      projectName,
      collectCoverageFrom,
      [getJestTsProjectRoot(submodule)],
      testMatch,
      testPathIgnorePatterns,
    ),
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
  };
}

/**
 * @param { ?string } package Project package
 * @returns { !string }
 */
function getJestTsProjectRoot(submodule) {
  return getJestProjectRoot(tsRoot, submodule);
}

/**
 * @param { !string } root Project root
 * @param { ?string } submoduleName Project package
 * @param { !string } testExtension Test extension files
 * @returns { !string }
 */
function getSubmoduleTestMatch(root, submoduleName, testExtension) {
  let testMatch;

  if (submoduleName === undefined) {
    testMatch = `${root}/**/*${testExtension}`;
  } else {
    testMatch = `${root}/${submoduleName}/**/*${testExtension}`;
  }

  return testMatch;
}

/**
 * @param { ?string } submoduleName Project package
 * @param { !string } testExtension Test extension files
 * @returns { !string }
 */
function getTsTestMatch(submoduleName, testExtension) {
  return getSubmoduleTestMatch(tsRoot, submoduleName, testExtension);
}

/**
 * @param { ?string } submoduleName Project package
 * @param { !string } testExtension Test extension files
 * @returns { !string }
 */
function getJsTestMatch(submoduleName, testExtension) {
  return getSubmoduleTestMatch(jsRoot, submoduleName, testExtension);
}

module.exports = {
  getJestProjectConfig,
  getJestJsProjectConfig,
  getJsTestMatch,
  getTsTestMatch,
  getJestTsProjectConfig,
};
