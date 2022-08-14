import { exec } from 'node:child_process';

/**
 * @param {string} command command
 * @param {boolean} interactive true to pipe standard input output and error streams
 * @returns {Promise<string>}
 */
export async function promisifiedExec(command, interactive = false) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, (error, stdout) => {
      if (error === null) {
        resolve(stdout);
      } else {
        reject(error);
      }
    });

    if (interactive) {
      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);

      process.stdin.pipe(childProcess.stdin);
    }
  });
}
