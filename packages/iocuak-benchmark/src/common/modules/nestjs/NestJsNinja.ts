import { Inject, Injectable, Scope } from '@nestjs/common';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { ThrowableWeapon } from '../domain/ThrowableWeapon';
import { Warrior } from '../domain/Warrior';
import { Weapon } from '../domain/Weapon';

@Injectable({
  scope: Scope.DEFAULT,
})
export class NestJsNinja implements Warrior {
  public static instanceCounter: number = 0;

  readonly #weapon: Weapon;
  readonly #throwableWeapon: ThrowableWeapon;

  constructor(
    @Inject(serviceTypeToSymbolMap[ServiceType.weapon]) weapon: Weapon,
    @Inject(serviceTypeToSymbolMap[ServiceType.throwableWeapon])
    throwableWeapon: ThrowableWeapon,
  ) {
    this.#weapon = weapon;
    this.#throwableWeapon = throwableWeapon;

    NestJsNinja.instanceCounter++;
  }

  public fight() {
    return this.#weapon.hit();
  }
  public sneak() {
    return this.#throwableWeapon.throw();
  }
}
