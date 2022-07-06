import { injectable, Lifecycle, scoped } from 'tsyringe';

import { ThrowableWeapon } from '../domain/ThrowableWeapon';

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class TsyringeShuriken implements ThrowableWeapon {
  public static instanceCounter: number = 0;

  constructor() {
    TsyringeShuriken.instanceCounter++;
  }

  public throw() {
    return 'hit!';
  }
}
