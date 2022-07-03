import { performance } from 'perf_hooks';

import { ServiceType } from '../../common/models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../common/models/domain/serviceTypeToSymbolMap';
import { Warrior } from '../../common/modules/domain/Warrior';
import { tsyringeContainer } from '../../common/modules/tsyringe/tsyringeContainer';

export function tsyringeRun(iterations: number): number {
  const startTime: number = performance.now();

  for (let i: number = 0; i < iterations; ++i) {
    tsyringeContainer.resolve<Warrior>(
      serviceTypeToSymbolMap[ServiceType.warrior],
    );
  }

  const tsyringeTime: number = performance.now() - startTime;

  return tsyringeTime;
}
