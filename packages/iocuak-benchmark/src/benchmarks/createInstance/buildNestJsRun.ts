import { performance } from 'perf_hooks';

import { INestApplicationContext } from '@nestjs/common';

import { ServiceType } from '../../common/models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../common/models/domain/serviceTypeToSymbolMap';

export function buildNestJsRun(
  nestJsApplicationContext: INestApplicationContext,
): (iterations: number) => number {
  return function nestJsRun(iterations: number): number {
    const startTime: number = performance.now();

    for (let i: number = 0; i < iterations; ++i) {
      nestJsApplicationContext.get(serviceTypeToSymbolMap[ServiceType.warrior]);
    }

    const nestJsTime: number = performance.now() - startTime;

    return nestJsTime;
  };
}
