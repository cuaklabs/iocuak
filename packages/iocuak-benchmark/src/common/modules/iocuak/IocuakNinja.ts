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
  readonly #weapon: Weapon;
  readonly #throwableWeapon: ThrowableWeapon;

  constructor(
    @inject(serviceTypeToSymbolMap[ServiceType.weapon]) weapon: Weapon,
    @inject(serviceTypeToSymbolMap[ServiceType.throwableWeapon])
    throwableWeapon: ThrowableWeapon,
  ) {
    this.#weapon = weapon;
    this.#throwableWeapon = throwableWeapon;
    IocuakNinja.instanceCounter++;
  }

  public fight() {
    return this.#weapon.hit();
  }
  public sneak() {
    return this.#throwableWeapon.throw();
  }
}
