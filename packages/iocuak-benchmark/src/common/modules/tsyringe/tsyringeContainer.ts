import { container, DependencyContainer } from 'tsyringe';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
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
  container.register(serviceTypeToSymbolMap[ServiceType.throwableWeapon], {
    useClass: TsyringeShuriken,
  });
  container.register(serviceTypeToSymbolMap[ServiceType.warrior], {
    useClass: TsyringeNinja,
  });
}

registerTsyringe();

export const tsyringeContainer: DependencyContainer = container;
