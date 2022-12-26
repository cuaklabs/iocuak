import { BindingScopeApi, BindOptionsApi } from '@cuaklabs/iocuak-models-api';

export class BindingOptionsApiFixtures {
  public static get any(): BindOptionsApi {
    return {
      scope: BindingScopeApi.request,
    };
  }

  public static get withNoScope(): BindOptionsApi {
    const fixture: BindOptionsApi = BindingOptionsApiFixtures.any;

    delete fixture.scope;

    return fixture;
  }
}
