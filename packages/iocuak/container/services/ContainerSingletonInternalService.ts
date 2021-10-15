import { ServiceId } from '../../task/models/domain/ServiceId';

export interface ContainerSingletonInternalService {
  get<TInstance>(serviceId: ServiceId): TInstance | undefined;
}
