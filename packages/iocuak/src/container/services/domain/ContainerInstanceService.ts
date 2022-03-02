import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ContainerInstanceService {
  create<TInstance>(serviceId: ServiceId): TInstance;
}
