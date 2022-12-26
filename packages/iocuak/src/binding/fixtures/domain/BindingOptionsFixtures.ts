import { BindingScope, BindOptions } from '@cuaklabs/iocuak-models';

export class BindingOptionsFixtures {
  public static get any(): BindOptions {
    return {
      scope: BindingScope.request,
    };
  }

  public static get withScopeUndefined(): BindOptions {
    const fixture: BindOptions = {
      ...BindingOptionsFixtures.any,
      scope: undefined,
    };

    return fixture;
  }
}
