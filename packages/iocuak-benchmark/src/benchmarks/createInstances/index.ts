import 'reflect-metadata';

import { iocuakRun } from './iocuakRun';
import { tsyringeRun } from './tsyringeRun';

function runTest(): void {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const instancesRuns: number[] = [100, 1_000, 10_000, 100_000, 1_000_000];

  const runners: ((instances: number) => number)[] = [iocuakRun, tsyringeRun];

  for (const instancesRun of instancesRuns) {
    for (const runner of runners) {
      const runMilliseconds: number = runner(instancesRun);

      console.log(
        `[${runner.name} with ${instancesRun} instances]: ${runMilliseconds} milliseconds.`,
      );
    }
  }
}

runTest();
