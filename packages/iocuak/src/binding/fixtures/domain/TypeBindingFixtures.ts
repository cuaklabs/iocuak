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
}
