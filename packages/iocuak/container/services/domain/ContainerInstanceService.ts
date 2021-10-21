import { ServiceId } from '../../../task/models/domain/ServiceId';

export interface ContainerInstanceService {
  create<TInstance>(serviceId: ServiceId): TInstance;
}
