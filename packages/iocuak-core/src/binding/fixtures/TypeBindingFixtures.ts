import { Newable, Tag } from '@cuaklabs/iocuak-common';
import {
  BindingScope,
  BindingType,
  TypeBinding,
} from '@cuaklabs/iocuak-models';

import { PickKeys } from '../../common/models/PickKeys';

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

  public static get withTagsOne(): TypeBinding & {
    [T in PickKeys<TypeBinding, 'tags'>]: [Tag] & Tag[];
  } {
    const fixture: TypeBinding & {
      [T in PickKeys<TypeBinding, 'tags'>]: [Tag] & Tag[];
    } = {
      ...TypeBindingFixtures.any,
      tags: ['tag'],
    };

    return fixture;
  }
}
