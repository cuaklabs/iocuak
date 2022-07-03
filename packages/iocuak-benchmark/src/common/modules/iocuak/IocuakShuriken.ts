import { BindingScope, injectable } from '@cuaklabs/iocuak';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { TagType } from '../../models/domain/TagType';
import { tagTypeToSymbolMap } from '../../models/domain/tagTypeToSymbolMap';
import { ThrowableWeapon } from '../domain/ThrowableWeapon';

@injectable({
  id: serviceTypeToSymbolMap[ServiceType.throwableWeapon],
  scope: BindingScope.singleton,
  tags: [tagTypeToSymbolMap[TagType.weapons]],
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
