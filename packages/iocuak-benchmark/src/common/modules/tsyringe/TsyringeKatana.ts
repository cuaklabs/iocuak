import { injectable, inject } from 'tsyringe';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { Handle } from '../domain/Handle';
import { Weapon } from '../domain/Weapon';

@injectable()
export class TsyringeKatana implements Weapon {
  public static instanceCounter: number = 0;

  readonly #handle: Handle;

  constructor(
    @inject(serviceTypeToSymbolMap[ServiceType.handle]) handle: Handle,
  ) {
    TsyringeKatana.instanceCounter++;
    this.#handle = handle;
  }

  public hit() {
    this.#handle.grab();

    return 'cut!';
  }
}
