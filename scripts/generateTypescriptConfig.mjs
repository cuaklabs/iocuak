import fs from 'fs';
import path from 'path';
import url from 'url';

/**
 * @returns {TypescriptConfig}
 */
function buildInitialPackagesTypescriptConfig() {
  return {
    files: [],
    references: [],
  };
}

/**
 * @param {string} packageDirectoryNames
 * @returns {TypescriptConfig}
 */
function buildTypescriptConfig(packageDirectoryNames) {
  const typescriptConfig = buildInitialPackagesTypescriptConfig();

  for (const packageDirectoryName of packageDirectoryNames) {
    typescriptConfig.references.push({
      path: `./packages/${packageDirectoryName}/tsconfig.json`,
    });
  }

  return typescriptConfig;
}

/**
 * @param {string} packageDirectoryNames
 * @returns {TypescriptConfig}
 */
function buildTypescriptDevConfig(packageDirectoryNames) {
  const typescriptConfig = buildInitialPackagesTypescriptConfig();

  for (const packageDirectoryName of packageDirectoryNames) {
    typescriptConfig.references.push({
      path: `./packages/${packageDirectoryName}/tsconfig.dev.json`,
    });
  }

  return typescriptConfig;
}

function main() {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const packagesDirectory = path.resolve(__dirname, '..', 'packages');
  const packageDirectoryNames = fs.readdirSync(packagesDirectory);

  const typescriptConfig = buildTypescriptConfig(packageDirectoryNames);
  const typescriptConfigPath = path.resolve(
    __dirname,
    '..',
    'tsconfig.packages.json',
  );

  const typescriptDevConfig = buildTypescriptDevConfig(packageDirectoryNames);
  const typescriptDevConfigPath = path.resolve(
    __dirname,
    '..',
    'tsconfig.packages.dev.json',
  );

  writeTypescriptConfig(typescriptConfigPath, typescriptConfig);
  writeTypescriptConfig(typescriptDevConfigPath, typescriptDevConfig);
}

/**
 * @param {string} path
 * @param {TypescriptConfig} typescriptConfig
 */
function writeTypescriptConfig(path, typescriptConfig) {
  const jsonIndentationSpaces = 2;

  const stringifiedTypescriptConfig =
    JSON.stringify(typescriptConfig, undefined, jsonIndentationSpaces) + '\n';

  fs.writeFileSync(path, stringifiedTypescriptConfig);
}

main();

/**
 * @typedef TypescriptConfig
 * @property {Array.<string>} files files
 * @property {Array.<TypescriptConfigReference>} references typescript config references
 */

/**
 * @typedef TypescriptConfigReference
 * @property {string} path Path to the typescript config
 */
