import { injectable, Lifecycle, scoped } from 'tsyringe';

import { Handle } from '../domain/Handle';

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class TsyringeHandle implements Handle {
  public static instanceCounter: number = 0;

  constructor() {
    TsyringeHandle.instanceCounter++;
  }

  public grab(): string {
    return 'grabbed!';
  }
}
