import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskScopeApi } from '../../../task/models/api/TaskScopeApi';

export interface InjectableOptionsApi {
  id?: ServiceId;
  scope?: TaskScopeApi;
}
