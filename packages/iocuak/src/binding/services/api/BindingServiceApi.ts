import { Newable, ServiceId } from '@cuaklabs/iocuak-common';

import { BindValueOptionsApi } from '../../../container/models/api/BindValueOptionsApi';
import { BindingApi } from '../../models/api/BindingApi';

export interface BindingServiceApi {
  bind<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): void;
  bindToValue(options: BindValueOptionsApi): void;
  getAllBindinds(): BindingApi[];
  unbind(serviceId: ServiceId): void;
}
