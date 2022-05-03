import { BindingApi } from '../../../binding/models/api/BindingApi';
import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ContainerBindingServiceApi {
  bind<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): void;
  bindToValue<TInstance>(serviceId: ServiceId, value: TInstance): void;
  getAllBindinds(): BindingApi[];
  unbind(serviceId: ServiceId): void;
}
