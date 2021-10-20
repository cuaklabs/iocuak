import { Binding } from '../../../binding/models/domain/Binding';
import { ServiceId } from '../../../task/models/domain/ServiceId';

export interface ContainerBindingService {
  get<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
  ): Binding<TInstance, TArgs> | undefined;

  remove(serviceId: ServiceId): void;

  set<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
    binding: Binding<TInstance, TArgs>,
  ): void;
}
