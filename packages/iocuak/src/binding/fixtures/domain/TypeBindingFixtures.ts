import { Newable } from '../../../common/models/domain/Newable';
import { BindingScope } from '../../models/domain/BindingScope';
import { BindingType } from '../../models/domain/BindingType';
import { TypeBinding } from '../../models/domain/TypeBinding';

export class TypeBindingFixtures {
  static readonly #type: Newable = class {};

  public static get any(): TypeBinding {
    const fixture: TypeBinding = {
      bindingType: BindingType.type,
      id: 'service-id',
      scope: BindingScope.request,
      tags: [],
      type: TypeBindingFixtures.#type,
    };

    return fixture;
  }

  public static get withScopeRequest(): TypeBinding {
    const fixture: TypeBinding = {
      ...TypeBindingFixtures.any,
      scope: BindingScope.request,
    };

    return fixture;
  }

  public static get withScopeSingleton(): TypeBinding {
    const fixture: TypeBinding = {
      ...TypeBindingFixtures.any,
      scope: BindingScope.singleton,
    };

    return fixture;
  }

  public static get withScopeTransient(): TypeBinding {
    const fixture: TypeBinding = {
      ...TypeBindingFixtures.any,
      scope: BindingScope.transient,
    };

    return fixture;
  }

  public static get withScopeTransientAndTagsEmpty(): TypeBinding {
    const fixture: TypeBinding = {
      ...TypeBindingFixtures.withScopeTransient,
      tags: [],
    };

    return fixture;
  }

  public static get withTagsEmpty(): TypeBinding {
    const fixture: TypeBinding = {
      ...TypeBindingFixtures.any,
      tags: [],
    };

    return fixture;
  }
}
