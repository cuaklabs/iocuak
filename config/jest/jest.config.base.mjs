import fs from 'fs';
import path from 'path';
import url from 'url';

const projectRoot = '<rootDir>/packages';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Builds a unit test and an integration test jest projects for a given package
 * @param {!string} packageName package name
 * @returns {!Array<import("jest").Config>}
 */
function buildPackageJsProjects(packageName) {
  return [
    buildUnitPackageJsProject(packageName),
    buildIntegrationPackageJsProject(packageName),
  ];
}

/**
 * Builds a unit test and an integration test jest projects for a given package
 * @param {!string} packageName package name
 * @returns {!Array<import("jest").Config>}
 */
function buildPackageTsProjects(packageName) {
  return [
    buildUnitPackageTsProject(packageName),
    buildIntegrationPackageTsProject(packageName),
  ];
}

/**
 * Builds an integration test jest projects for a given package
 * @param {!string} packageName package name
 * @returns { !import("jest").Config } Jest config
 */
function buildIntegrationPackageJsProject(packageName) {
  return getJestJsProjectConfig(
    `${packageName}-Integration`,
    ['/node_modules'],
    packageName,
    '.int.spec.js',
  );
}

/**
 * Builds an integration test jest projects for a given package
 * @param {!string} packageName package name
 * @returns { !import("jest").Config } Jest config
 */
function buildIntegrationPackageTsProject(packageName) {
  return getJestTsProjectConfig(
    `${packageName}-Integration`,
    ['/node_modules'],
    packageName,
    '.int.spec.ts',
  );
}

/**
 * Builds a unit test jest projects for a given package
 * @param {!string} packageName package name
 * @returns { !import("jest").Config } Jest config
 */
function buildUnitPackageJsProject(packageName) {
  return getJestJsProjectConfig(
    `${packageName}-Unit`,
    ['/node_modules', '.int.spec.js'],
    packageName,
    '.spec.js',
  );
}

/**
 * Builds a unit test jest projects for a given package
 * @param {!string} packageName package name
 * @returns { !import("jest").Config } Jest config
 */
function buildUnitPackageTsProject(packageName) {
  return getJestTsProjectConfig(
    `${packageName}-Unit`,
    ['/node_modules', '.int.spec.ts'],
    packageName,
    '.spec.ts',
  );
}

/**
 * @param { string } packageName package name
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } collectCoverageFrom expressions to match to a file covered by IstambulJs
 * @param { !Array<string> } roots Jest roots
 * @param { !Array<string> } testMatch Expressions to match to test file paths
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @returns { !import("jest").Config } Jest config
 */
function getJestProjectConfig(
  packageName,
  projectName,
  roots,
  testMatch,
  testPathIgnorePatterns,
) {
  /** @type { !import("jest").Config } */
  const projectConfig = {
    displayName: projectName,
    coveragePathIgnorePatterns: [
      ...getPackagesUnlessPackageIgnorePatterns(packageName),
      '/e2e/definitions/',
      '/fixtures/',
      '/lib/index.js',
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
 * @param { ?string } packageName Project package
 * @param { ?string } extension Test extension to match
 * @returns { !import("jest").Config } Jest config
 */
function getJestJsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  packageName,
  extension,
) {
  const testMatch = [getJsTestMatch(packageName, extension)];

  return getJestProjectConfig(
    packageName,
    projectName,
    [getJestPackageProjectRoot(packageName)],
    testMatch,
    testPathIgnorePatterns,
  );
}

/**
 * @param { ?string } packageName Project package
 * @returns { !string }
 */
function getJestPackageProjectRoot(packageName) {
  return getJestProjectRoot(projectRoot, packageName);
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
    projectRoots = path.join(root, submodule);
  }

  return projectRoots;
}

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { ?string } package Project package
 * @param { ?string } extension Test extension to match
 * @returns @returns { !import("jest").Config } Jest config
 */
function getJestTsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  packageName,
  extension,
) {
  const testMatch = [getTsTestMatch(packageName, extension)];

  return {
    ...getJestProjectConfig(
      packageName,
      projectName,
      [getJestPackageProjectRoot(packageName)],
      testMatch,
      testPathIgnorePatterns,
    ),
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
  };
}

/**
 * @param {string} packageName Package name
 * @returns {Array.<string>}
 */
function getPackagesUnlessPackageIgnorePatterns(packageName) {
  if (packageName === undefined) {
    return [];
  } else {
    const packagesUnlessPackage = getPackages().filter(
      (packagesPackageName) => packagesPackageName != packageName,
    );

    return packagesUnlessPackage.map(
      (packageName) => `<rootDir>/packages/${packageName}/`,
    );
  }
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
  return getSubmoduleTestMatch(projectRoot, submoduleName, testExtension);
}

/**
 * @param { ?string } submoduleName Project package
 * @param { !string } testExtension Test extension files
 * @returns { !string }
 */
function getJsTestMatch(submoduleName, testExtension) {
  return getSubmoduleTestMatch(projectRoot, submoduleName, testExtension);
}

/**
 * @returns { !Array<string> }
 */
function getPackages() {
  const packagesDirectory = path.resolve(__dirname, '..', '..', 'packages');
  const packageDirectoryNames = fs.readdirSync(packagesDirectory);

  return packageDirectoryNames;
}

export {
  buildPackageJsProjects,
  buildPackageTsProjects,
  getJestJsProjectConfig,
  getJsTestMatch,
  getTsTestMatch,
  getJestTsProjectConfig,
  getPackages,
};
