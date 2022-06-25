import { CreateTagInstancesTaskKind } from '../../models/domain/CreateTagInstancesTaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateTagInstancesTaskKindFixtures {
  public static get any(): CreateTagInstancesTaskKind {
    const fixture: CreateTagInstancesTaskKind = {
      tag: Symbol(),
      type: TaskKindType.createTagInstances,
    };

    return fixture;
  }
}
