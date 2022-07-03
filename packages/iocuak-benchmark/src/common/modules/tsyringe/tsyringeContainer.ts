import { container, DependencyContainer } from 'tsyringe';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { TagType } from '../../models/domain/TagType';
import { tagTypeToSymbolMap } from '../../models/domain/tagTypeToSymbolMap';
import { TsyringeHandle } from './TsyringeHandle';
import { TsyringeKatana } from './TsyringeKatana';
import { TsyringeNinja } from './TsyringeNinja';
import { TsyringeShuriken } from './TsyringeShuriken';

export function registerTsyringe() {
  container.register(serviceTypeToSymbolMap[ServiceType.handle], {
    useClass: TsyringeHandle,
  });
  container.register(serviceTypeToSymbolMap[ServiceType.weapon], {
    useClass: TsyringeKatana,
  });
  container.register(tagTypeToSymbolMap[TagType.weapons], {
    useClass: TsyringeKatana,
  });
  container.register(serviceTypeToSymbolMap[ServiceType.throwableWeapon], {
    useClass: TsyringeShuriken,
  });
  container.register(tagTypeToSymbolMap[TagType.weapons], {
    useClass: TsyringeShuriken,
  });
  container.register(serviceTypeToSymbolMap[ServiceType.warrior], {
    useClass: TsyringeNinja,
  });
}

registerTsyringe();

export const tsyringeContainer: DependencyContainer = container;
