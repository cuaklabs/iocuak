import { Binding } from '../../../binding/models/domain/Binding';
import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ContainerBindingService {
  get<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
  ): Binding<TInstance, TArgs> | undefined;

  getAll(): Map<ServiceId, Binding>;

  remove(serviceId: ServiceId): void;

  set<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
    binding: Binding<TInstance, TArgs>,
  ): void;
}
