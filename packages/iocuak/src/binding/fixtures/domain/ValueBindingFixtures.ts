import { ValueBinding, BindingType } from '@cuaklabs/iocuak-models';

export class ValueBindingFixtures {
  public static get any(): ValueBinding {
    const fixture: ValueBinding = {
      bindingType: BindingType.value,
      id: 'service-id',
      tags: [],
      value: { foo: 'bar' },
    };

    return fixture;
  }

  public static get withNoTags(): ValueBinding {
    const fixture: ValueBinding = {
      ...ValueBindingFixtures.any,
      tags: [],
    };

    return fixture;
  }
}
