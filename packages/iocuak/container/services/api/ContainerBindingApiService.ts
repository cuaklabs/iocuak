import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ContainerBindingApiService {
  bind<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): void;
  bindToValue<TInstance>(serviceId: ServiceId, value: TInstance): void;
  unbind(serviceId: ServiceId): void;
}
