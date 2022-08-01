import { exec } from 'node:child_process';
import { argv } from 'node:process';

/**
 * @param {string} command command
 * @returns {Promise<string>}
 */
async function promisifyExec(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error === null) {
        resolve(stdout);
      } else {
        reject(error);
      }
    });
  });
}

const baseRef = argv[2];

const stringifiedPackages = await promisifyExec(
  `pnpm exec nx print-affected --base=${baseRef} --head=HEAD --select=projects`,
);

const packageNames = stringifiedPackages
  .split(',')
  .map((packageName) => packageName.trim());

console.log(JSON.stringify({ package: packageNames }));
