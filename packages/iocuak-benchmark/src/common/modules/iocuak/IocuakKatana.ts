import { BindingScope, inject, injectable } from '@cuaklabs/iocuak';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { TagType } from '../../models/domain/TagType';
import { tagTypeToSymbolMap } from '../../models/domain/tagTypeToSymbolMap';
import { Handle } from '../domain/Handle';
import { Weapon } from '../domain/Weapon';

@injectable({
  id: serviceTypeToSymbolMap[ServiceType.weapon],
  scope: BindingScope.singleton,
  tags: [tagTypeToSymbolMap[TagType.weapons]],
})
export class IocuakKatana implements Weapon {
  public static instanceCounter: number = 0;
  readonly #handle: Handle;

  constructor(
    @inject(serviceTypeToSymbolMap[ServiceType.handle]) handle: Handle,
  ) {
    IocuakKatana.instanceCounter++;
    this.#handle = handle;
  }

  public hit() {
    this.#handle.grab();

    return 'cut!';
  }
}
