import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ContainerInstanceServiceApi {
  get<TInstance>(serviceId: ServiceId): TInstance;
}
