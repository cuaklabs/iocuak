import { exec } from 'node:child_process';

/**
 * @param {string} command command
 * @param {PromisifiedExecOptions} options true to pipe standard input output and error streams
 * @returns {Promise<string>}
 */
export async function promisifiedExec(command, options) {
  options = {
    cwd: options?.cwd,
    interactive: options?.interactive ?? false,
  };

  return new Promise((resolve, reject) => {
    const childProcess = exec(
      command,
      {
        cwd: options.cwd,
      },
      (error, stdout) => {
        if (error === null) {
          resolve(stdout);
        } else {
          reject(error);
        }
      },
    );

    if (options.interactive) {
      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);

      process.stdin.pipe(childProcess.stdin);
    }
  });
}

/**
 * @typedef {Object} PromisifiedExecOptions
 * @property {boolean} interactive
 * @property {string} cwd
 */
