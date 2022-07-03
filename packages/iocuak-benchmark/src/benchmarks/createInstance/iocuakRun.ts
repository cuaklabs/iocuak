import { performance } from 'perf_hooks';

import { ServiceType } from '../../common/models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../common/models/domain/serviceTypeToSymbolMap';
import { iocuakContainer } from '../../common/modules/iocuak/iocuakContainer';

export function iocuakRun(numInstances: number): number {
  const startTime: number = performance.now();

  for (let i: number = 0; i < numInstances; i++) {
    iocuakContainer.get(serviceTypeToSymbolMap[ServiceType.warrior]);
  }
  const iocuakTime: number = performance.now() - startTime;

  return iocuakTime;
}
