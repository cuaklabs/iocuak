import { performance } from 'perf_hooks';

import { TagType } from '../../common/models/domain/TagType';
import { tagTypeToSymbolMap } from '../../common/models/domain/tagTypeToSymbolMap';
import { ThrowableWeapon } from '../../common/modules/domain/ThrowableWeapon';
import { Weapon } from '../../common/modules/domain/Weapon';
import { tsyringeContainer } from '../../common/modules/tsyringe/tsyringeContainer';

export function tsyringeRun(iterations: number): number {
  const startTime: number = performance.now();

  for (let i: number = 0; i < iterations; ++i) {
    tsyringeContainer.resolveAll<Weapon | ThrowableWeapon>(
      tagTypeToSymbolMap[TagType.weapons],
    );
  }

  const tsyringeTime: number = performance.now() - startTime;

  return tsyringeTime;
}
