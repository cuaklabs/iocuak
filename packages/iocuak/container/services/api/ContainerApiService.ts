import { Newable } from '../../../task/models/domain/Newable';
import { ServiceId } from '../../../task/models/domain/ServiceId';

export interface ContainerApiService {
  bind<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): void;
  get<TInstance>(serviceId: ServiceId): TInstance;
  unbind(serviceId: ServiceId): void;
}
