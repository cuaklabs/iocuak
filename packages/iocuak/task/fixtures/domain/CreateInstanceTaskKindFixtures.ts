import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateInstanceTaskKindFixtures {
  public static get any(): CreateInstanceTaskKind {
    const fixture: CreateInstanceTaskKind = {
      id: 'sample-id',
      type: TaskKindType.createInstance,
    };

    return fixture;
  }
}
