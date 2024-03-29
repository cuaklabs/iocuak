import { injectable, Lifecycle, scoped } from 'tsyringe';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { ThrowableWeapon } from '../domain/ThrowableWeapon';
import { Warrior } from '../domain/Warrior';
import { Weapon } from '../domain/Weapon';
import { tsyringeInject } from './tsyringeInject';

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class TsyringeNinja implements Warrior {
  public static instanceCounter: number = 0;

  readonly #weapon: Weapon;
  readonly #throwableWeapon: ThrowableWeapon;

  constructor(
    @tsyringeInject(serviceTypeToSymbolMap[ServiceType.weapon]) weapon: Weapon,
    @tsyringeInject(serviceTypeToSymbolMap[ServiceType.throwableWeapon])
    throwableWeapon: ThrowableWeapon,
  ) {
    this.#weapon = weapon;
    this.#throwableWeapon = throwableWeapon;
    TsyringeNinja.instanceCounter++;
  }

  public fight() {
    return this.#weapon.hit();
  }
  public sneak() {
    return this.#throwableWeapon.throw();
  }
}
