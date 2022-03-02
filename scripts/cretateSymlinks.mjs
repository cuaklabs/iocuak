import fs from 'fs';
import path from 'path';
import url from 'url';

/**
 * Scans npm package for a package.json and extracts its name
 * @param {string} packageDirectory package directory
 * @returns string npm package name
 */
function getPackageName(packageDirectory) {
  const packageJsonPath = path.resolve(packageDirectory, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    const packageJsonObject = JSON.parse(fs.readFileSync(packageJsonPath).toString());
    if ('name' in packageJsonObject && typeof packageJsonObject.name === 'string') {
      /** @type string */
      const packageName = packageJsonObject.name;

      return packageName;
    } else {
      throw new Error(`Unable to parse name of npm package at "${packageJsonPath}"`)
    }
  } else {
    throw new Error(`Unable to locale package json file of package "${packageDirectory}"`);
  }
}

/**
 * Parses a package name and builds a path to its directory in a certain node_modules directory.
 * @param {string} nodeModulesDirectory node_modules directory
 * @param {string} packageName npm package name
 * @returns string module directory.
 */
function getPackageDirectory(nodeModulesDirectory, packageName) {
  const orgSeparator = '/';
  return path.resolve(nodeModulesDirectory, ...packageName.split(orgSeparator));
}

/**
 * Links a local package in a certain node_modules folder
 * @param {string} nodeModulesDirectory node_modules directory
 * @param {string} packageDirectory package directory
 */
function linkPackage(nodeModulesDirectory, packageDirectory) {
  const packageName = getPackageName(packageDirectory);

  const moduleDirectory = getPackageDirectory(nodeModulesDirectory, packageName);

  if (fs.existsSync(moduleDirectory)) {
    fs.rmSync(moduleDirectory, { recursive: true, force: true });
  } else {
    const moduleParentDirectory = path.resolve(moduleDirectory, '..');

    if (!fs.existsSync(moduleParentDirectory)) {
      fs.mkdirSync(moduleParentDirectory, { recursive: true });
    }
  }

  fs.symlinkSync(packageDirectory, moduleDirectory, 'dir');
}

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nodeModulesDirectory = path.resolve(__dirname, '..', 'node_modules');
const packagesDirectory = path.resolve(__dirname, '..', 'packages');

const packageDirectoryNames = fs.readdirSync(packagesDirectory);

for (const packageDirectoryName of packageDirectoryNames) {
  const packageDirectory = path.resolve(packagesDirectory, packageDirectoryName);
  linkPackage(nodeModulesDirectory, packageDirectory);
}
