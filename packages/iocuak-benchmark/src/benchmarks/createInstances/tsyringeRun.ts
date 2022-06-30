import { performance } from 'perf_hooks';

import { ServiceType } from '../../common/models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../common/models/domain/serviceTypeToSymbolMap';
import { Warrior } from '../../common/modules/domain/Warrior';
import { tsyringeContainer } from '../../common/modules/tsyringe/tsyringeContainer';

export function tsyringeRun(numInstances: number): number {
  const startTime: number = performance.now();

  for (let i: number = 0; i < numInstances; i++) {
    tsyringeContainer.resolve<Warrior>(
      serviceTypeToSymbolMap[ServiceType.warrior],
    );
  }
  const iocuakTime: number = performance.now() - startTime;

  return iocuakTime;
}
