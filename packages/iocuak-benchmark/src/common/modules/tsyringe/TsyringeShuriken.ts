import { injectable } from 'tsyringe';

import { ThrowableWeapon } from '../domain/ThrowableWeapon';

@injectable()
export class TsyringeShuriken implements ThrowableWeapon {
  public static instanceCounter: number = 0;

  constructor() {
    TsyringeShuriken.instanceCounter++;
  }

  public throw() {
    return 'hit!';
  }
}
