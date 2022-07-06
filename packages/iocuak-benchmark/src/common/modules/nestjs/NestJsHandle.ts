import { Injectable, Scope } from '@nestjs/common';

import { Handle } from '../domain/Handle';

@Injectable({
  scope: Scope.DEFAULT,
})
export class NestJsHandle implements Handle {
  public static instanceCounter: number = 0;

  constructor() {
    NestJsHandle.instanceCounter++;
  }

  public grab(): string {
    return 'grabbed!';
  }
}
