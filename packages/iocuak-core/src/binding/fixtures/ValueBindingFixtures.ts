import { BindingType, ValueBinding } from '@cuaklabs/iocuak-models';

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

  public static get withTagsOne(): ValueBinding {
    const fixture: ValueBinding = {
      ...ValueBindingFixtures.any,
      tags: ['tag-sample'],
    };

    return fixture;
  }
}
