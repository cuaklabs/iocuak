import { Newable } from '../../../task/models/domain/Newable';
import { ServiceId } from '../../../task/models/domain/ServiceId';

export interface ContainerBindingApiService {
  bind<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): void;
  unbind(serviceId: ServiceId): void;
}
