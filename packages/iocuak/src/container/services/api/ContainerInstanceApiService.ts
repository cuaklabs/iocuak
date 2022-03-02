import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ContainerInstanceApiService {
  get<TInstance>(serviceId: ServiceId): TInstance;
}
