import { Binding } from '../../../binding/models/domain/Binding';
import { ServiceId } from '../../../task/models/domain/ServiceId';

export interface ContainerBindingService {
  get(serviceId: ServiceId): Binding | undefined;
}
