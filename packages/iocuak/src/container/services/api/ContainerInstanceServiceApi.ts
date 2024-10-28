import { ServiceId, Tag } from '@cuaklabs/iocuak-common';

export interface ContainerInstanceServiceApi {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  get<TInstance>(serviceId: ServiceId): TInstance;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  getByTag<TInstances extends unknown[] = unknown[]>(tag: Tag): TInstances;
}
