import { Injectable, Scope } from '@nestjs/common';

import { ThrowableWeapon } from '../domain/ThrowableWeapon';

@Injectable({
  scope: Scope.DEFAULT,
})
export class NestJsShuriken implements ThrowableWeapon {
  public static instanceCounter: number = 0;

  constructor() {
    NestJsShuriken.instanceCounter++;
  }

  public throw() {
    return 'hit!';
  }
}
