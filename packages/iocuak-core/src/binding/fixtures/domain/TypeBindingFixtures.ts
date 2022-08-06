import { Newable } from '@cuaklabs/iocuak-common';
import {
  TypeBinding,
  BindingScope,
  BindingType,
} from '@cuaklabs/iocuak-models';

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
}
