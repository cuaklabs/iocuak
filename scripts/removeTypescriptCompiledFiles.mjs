import fs from 'fs';
import path from 'path';
import url from 'url';

import rimraf from 'rimraf';

/**
 * Deletes a directory recursively
 * @param {string} path path to directory to delete
 * @returns {Promise.<void>}
 */
async function rimrafAsync(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, (error) => {
      if (error == null) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}

/**
 * Deletes multiple directories recursively
 * @param {Array.<string>} directories direcotries to delete
 * @returns {Promise.<void>}
 */
async function deleteDirectoriesRecursively(directories) {
  await Promise.all(
    directories.map(async (directory) => rimrafAsync(directory)),
  );
}

async function main() {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const packagesDirectory = path.resolve(__dirname, '..', 'packages');
  const packageDirectoryNames = fs.readdirSync(packagesDirectory);

  const packageCompiledFilesDirectories = packageDirectoryNames.map(
    (packageDirectoryName) =>
      path.resolve(packagesDirectory, packageDirectoryName, 'lib'),
  );

  await deleteDirectoriesRecursively(packageCompiledFilesDirectories);
}

await main();
