import { Newable } from '@cuaklabs/iocuak-common';
import {
  BindingScope,
  BindingType,
  TypeBinding,
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

  public static get withTagsOne(): TypeBinding {
    const fixture: TypeBinding = {
      ...TypeBindingFixtures.any,
      tags: ['tag-sample'],
    };

    return fixture;
  }
}
