import { ServiceType } from './ServiceType';

export const serviceTypeToSymbolMap: Record<ServiceType, symbol> = {
  [ServiceType.handle]: Symbol(),
  [ServiceType.throwableWeapon]: Symbol(),
  [ServiceType.warrior]: Symbol(),
  [ServiceType.weapon]: Symbol(),
};
