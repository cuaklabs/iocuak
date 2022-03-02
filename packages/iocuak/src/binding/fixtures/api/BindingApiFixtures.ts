import { TaskScope } from '../../../task/models/domain/TaskScope';
import { BindingApi } from '../../models/api/BindingApi';

export class BindingApiFixtures {
  public static get empty(): BindingApi {
    const fixture: BindingApi = {};

    return fixture;
  }

  public static get withId(): BindingApi {
    const fixture: BindingApi = {
      id: 'sample-id',
    };

    return fixture;
  }

  public static get withScope(): BindingApi {
    const fixture: BindingApi = {
      scope: TaskScope.singleton,
    };

    return fixture;
  }
}
