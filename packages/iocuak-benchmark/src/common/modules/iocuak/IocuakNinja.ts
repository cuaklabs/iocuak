import { BindingScope, inject, injectable } from '@cuaklabs/iocuak';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { ThrowableWeapon } from '../domain/ThrowableWeapon';
import { Warrior } from '../domain/Warrior';
import { Weapon } from '../domain/Weapon';

@injectable({
  id: serviceTypeToSymbolMap[ServiceType.warrior],
  scope: BindingScope.singleton,
})
export class IocuakNinja implements Warrior {
  public static instanceCounter: number = 0;
  #katana: Weapon;
  #shuriken: ThrowableWeapon;

  constructor(
    @inject(serviceTypeToSymbolMap[ServiceType.weapon]) katana: Weapon,
    @inject(serviceTypeToSymbolMap[ServiceType.throwableWeapon])
    shuriken: ThrowableWeapon,
  ) {
    this.#katana = katana;
    this.#shuriken = shuriken;
    IocuakNinja.instanceCounter++;
  }

  public fight() {
    return this.#katana.hit();
  }
  public sneak() {
    return this.#shuriken.throw();
  }
}
