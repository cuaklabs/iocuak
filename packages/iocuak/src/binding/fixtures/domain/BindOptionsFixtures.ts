import { BindingScope, BindOptions } from '@cuaklabs/iocuak-models';

export class BindOptionsFixtures {
  public static get any(): BindOptions {
    return {
      scope: BindingScope.request,
    };
  }

  public static get withScopeDefined(): BindOptions {
    return {
      ...BindOptionsFixtures.any,
      scope: BindingScope.request,
    };
  }

  public static get withScopeUndefined(): BindOptions {
    const fixture: BindOptions = {
      ...BindOptionsFixtures.any,
      scope: undefined,
    };

    return fixture;
  }
}
