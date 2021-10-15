import { Binding } from '../../binding/models/domain/Binding';
import { ServiceId } from '../../task/models/domain/ServiceId';

export interface ContainerBindingInternalService {
  get(serviceId: ServiceId): Binding | undefined;
}
