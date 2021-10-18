import { Binding } from '../../../binding/models/domain/Binding';
import { ServiceId } from '../../../task/models/domain/ServiceId';

export interface ContainerBindingService {
  get<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
  ): Binding<TInstance, TArgs> | undefined;
}
