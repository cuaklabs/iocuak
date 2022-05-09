import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateInstanceTaskKindFixtures {
  public static get any(): CreateInstanceTaskKind {
    const fixture: CreateInstanceTaskKind = {
      binding: ValueBindingFixtures.any,
      id: 'sample-id',
      requestId: Symbol(),
      type: TaskKindType.createInstance,
    };

    return fixture;
  }
}
