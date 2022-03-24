import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskScope } from '../../../task/models/domain/TaskScope';

export interface InjectableOptionsApi {
  id?: ServiceId;
  scope?: TaskScope;
}
