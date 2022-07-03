import { performance } from 'perf_hooks';

import { TagType } from '../../common/models/domain/TagType';
import { tagTypeToSymbolMap } from '../../common/models/domain/tagTypeToSymbolMap';
import { iocuakContainer } from '../../common/modules/iocuak/iocuakContainer';

export function iocuakRun(iterations: number): number {
  const startTime: number = performance.now();

  for (let i: number = 0; i < iterations; ++i) {
    iocuakContainer.getByTag(tagTypeToSymbolMap[TagType.weapons]);
  }
  const iocuakTime: number = performance.now() - startTime;

  return iocuakTime;
}
