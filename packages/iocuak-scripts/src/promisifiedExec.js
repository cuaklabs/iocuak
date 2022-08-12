import { exec } from 'node:child_process';

/**
 * @param {string} command command
 * @returns {Promise<string>}
 */
export async function promisifiedExec(command) {
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
