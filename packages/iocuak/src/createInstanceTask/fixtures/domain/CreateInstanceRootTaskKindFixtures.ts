import { CreateInstanceRootTaskKind } from '../../models/domain/CreateInstanceRootTaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateInstanceRootTaskKindFixtures {
  public static get any(): CreateInstanceRootTaskKind {
    const fixture: CreateInstanceRootTaskKind = {
      id: 'sample-id',
      requestId: Symbol(),
      type: TaskKindType.createInstanceRoot,
    };

    return fixture;
  }
}
