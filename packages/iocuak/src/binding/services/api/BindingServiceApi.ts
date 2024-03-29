import { Newable, ServiceId } from '@cuaklabs/iocuak-common';
import { BindingApi, BindOptionsApi } from '@cuaklabs/iocuak-models-api';

import { BindValueOptionsApi } from '../../../container/models/api/BindValueOptionsApi';

export interface BindingServiceApi {
  bind<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
    options?: BindOptionsApi,
  ): void;
  bindToValue(options: BindValueOptionsApi): void;
  getAllBindinds(): BindingApi[];
  unbind(serviceId: ServiceId): void;
}
