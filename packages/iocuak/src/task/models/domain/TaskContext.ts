import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskContextActions } from './TaskContextActions';
import { TaskContextServices } from './TaskContextServices';

export interface TaskContext {
  actions: TaskContextActions;
  requestId: symbol;
  services: TaskContextServices;
  servicesInstantiatedSet: Set<ServiceId>;
}
