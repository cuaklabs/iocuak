import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Binding } from '../../../metadata/models/domain/Binding';

export interface ContainerBindingService {
  get<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
  ): Binding<TInstance, TArgs> | undefined;

  getAll(): Map<ServiceId, Binding>;

  remove(serviceId: ServiceId): void;

  set<TInstance, TArgs extends unknown[]>(
    binding: Binding<TInstance, TArgs>,
  ): void;
}
