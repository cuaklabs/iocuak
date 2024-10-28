import 'reflect-metadata';

import { buildNestJsApplicationContext } from '../../common/modules/nestjs/buildNestJsApplicationContext';
import { buildNestJsRun } from './buildNestJsRun';
import { iocuakRun } from './iocuakRun';
import { tsyringeRun } from './tsyringeRun';

async function runTest(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const instancesRuns: number[] = [100, 1_000, 10_000, 100_000, 1_000_000];

  const runners: ((instances: number) => number)[] = [
    iocuakRun,
    buildNestJsRun(await buildNestJsApplicationContext()),
    tsyringeRun,
  ];

  for (const iterations of instancesRuns) {
    for (const runner of runners) {
      const runMilliseconds: number = runner(iterations);

      console.log(
        `[${runner.name} with ${iterations.toString()} iterations]: ${runMilliseconds.toString()} milliseconds.`,
      );
    }
  }
}

void runTest();
