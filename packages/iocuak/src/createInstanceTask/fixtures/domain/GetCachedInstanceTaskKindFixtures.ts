import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { GetCachedInstanceTaskKind } from '../../models/domain/GetCachedInstanceTaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class GetCachedInstanceTaskKindFixtures {
  static #requestIdSymbol: symbol = Symbol();

  public static get any(): GetCachedInstanceTaskKind {
    const fixture: GetCachedInstanceTaskKind = {
      binding: TypeBindingFixtures.any,
      requestId: GetCachedInstanceTaskKindFixtures.#requestIdSymbol,
      type: TaskKindType.getCachedInstance,
    };

    return fixture;
  }
}
