import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateInstanceTaskKindFixtures {
  static #requestIdSymbol: symbol = Symbol();

  public static get any(): CreateInstanceTaskKind {
    const fixture: CreateInstanceTaskKind = {
      binding: ValueBindingFixtures.any,
      requestId: CreateInstanceTaskKindFixtures.#requestIdSymbol,
      type: TaskKindType.createInstance,
    };

    return fixture;
  }
}
