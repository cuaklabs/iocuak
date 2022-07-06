import { Inject, Injectable, Scope } from '@nestjs/common';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { Handle } from '../domain/Handle';
import { Weapon } from '../domain/Weapon';

@Injectable({
  scope: Scope.DEFAULT,
})
export class NestJsKatana implements Weapon {
  public static instanceCounter: number = 0;

  readonly #handle: Handle;

  constructor(
    @Inject(serviceTypeToSymbolMap[ServiceType.handle]) handle: Handle,
  ) {
    NestJsKatana.instanceCounter++;

    this.#handle = handle;
  }

  public hit() {
    this.#handle.grab();

    return 'cut!';
  }
}
