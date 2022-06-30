import { inject, injectable } from 'tsyringe';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { ThrowableWeapon } from '../domain/ThrowableWeapon';
import { Warrior } from '../domain/Warrior';
import { Weapon } from '../domain/Weapon';

@injectable()
export class TsyringeNinja implements Warrior {
  public static instanceCounter: number = 0;

  readonly #katana: Weapon;
  readonly #shuriken: ThrowableWeapon;

  constructor(
    @inject(serviceTypeToSymbolMap[ServiceType.weapon]) katana: Weapon,
    @inject(serviceTypeToSymbolMap[ServiceType.throwableWeapon])
    shuriken: ThrowableWeapon,
  ) {
    this.#katana = katana;
    this.#shuriken = shuriken;
    TsyringeNinja.instanceCounter++;
  }

  public fight() {
    return this.#katana.hit();
  }
  public sneak() {
    return this.#shuriken.throw();
  }
}
