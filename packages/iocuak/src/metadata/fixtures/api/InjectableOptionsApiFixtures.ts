import { TaskScope } from '../../../task/models/domain/TaskScope';
import { InjectableOptionsApi } from '../../models/api/InjectableOptionsApi';

export class InjectableOptionsApiFixtures {
  public static get empty(): InjectableOptionsApi {
    const fixture: InjectableOptionsApi = {};

    return fixture;
  }

  public static get withId(): InjectableOptionsApi {
    const fixture: InjectableOptionsApi = {
      id: 'sample-id',
    };

    return fixture;
  }

  public static get withScope(): InjectableOptionsApi {
    const fixture: InjectableOptionsApi = {
      scope: TaskScope.singleton,
    };

    return fixture;
  }
}
