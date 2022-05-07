import { CreateArrayTaskKind } from '../../models/domain/CreateArrayTaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateArrayTaskKindFixtures {
  public static get any(): CreateArrayTaskKind {
    const fixture: CreateArrayTaskKind = {
      requestId: Symbol(),
      type: TaskKindType.createArray,
    };

    return fixture;
  }
}
