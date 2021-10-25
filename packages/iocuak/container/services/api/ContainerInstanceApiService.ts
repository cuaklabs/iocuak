import { ServiceId } from '../../../task/models/domain/ServiceId';

export interface ContainerInstanceApiService {
  get<TInstance>(serviceId: ServiceId): TInstance;
}
