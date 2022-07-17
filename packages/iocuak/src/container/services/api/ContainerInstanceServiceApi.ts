import { ServiceId } from '@cuaklabs/iocuak-common';

import { BindingTag } from '../../../binding/models/domain/BindingTag';

export interface ContainerInstanceServiceApi {
  get<TInstance>(serviceId: ServiceId): TInstance;
  getByTag<TInstances extends unknown[] = unknown[]>(
    tag: BindingTag,
  ): TInstances;
}
