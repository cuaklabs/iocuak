import { ServiceId, Tag } from '@cuaklabs/iocuak-common';

export interface ContainerInstanceServiceApi {
  get<TInstance>(serviceId: ServiceId): TInstance;
  getByTag<TInstances extends unknown[] = unknown[]>(tag: Tag): TInstances;
}
