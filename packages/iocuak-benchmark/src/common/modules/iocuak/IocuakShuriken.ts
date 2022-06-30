import { BindingScope, injectable } from '@cuaklabs/iocuak';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { ThrowableWeapon } from '../domain/ThrowableWeapon';

@injectable({
  id: serviceTypeToSymbolMap[ServiceType.throwableWeapon],
  scope: BindingScope.singleton,
})
export class IocuakShuriken implements ThrowableWeapon {
  public static instanceCounter: number = 0;

  constructor() {
    IocuakShuriken.instanceCounter++;
  }

  public throw() {
    return 'hit!';
  }
}
