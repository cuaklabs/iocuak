import { Newable } from '@cuaklabs/iocuak-common';

import { ServiceId } from '../../../common/models/domain/ServiceId';
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
