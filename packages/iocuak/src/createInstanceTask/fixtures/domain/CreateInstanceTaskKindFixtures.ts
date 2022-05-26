import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ValueBinding } from '../../../binding/models/domain/ValueBinding';
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

  public static get withBindingType(): CreateInstanceTaskKind<TypeBinding> {
    const fixture: CreateInstanceTaskKind<TypeBinding> = {
      ...CreateInstanceTaskKindFixtures.any,
      binding: TypeBindingFixtures.any,
    };

    return fixture;
  }

  public static get withBindingValue(): CreateInstanceTaskKind<ValueBinding> {
    const fixture: CreateInstanceTaskKind<ValueBinding> = {
      ...CreateInstanceTaskKindFixtures.any,
      binding: ValueBindingFixtures.any,
    };

    return fixture;
  }
}
