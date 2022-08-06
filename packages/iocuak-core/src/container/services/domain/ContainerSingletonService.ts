import { ServiceId } from '@cuaklabs/iocuak-common';

export interface ContainerSingletonService {
  get<TInstance>(serviceId: ServiceId): TInstance | undefined;
  remove(serviceId: ServiceId): void;
  set<TInstance>(serviceId: ServiceId, value: TInstance): void;
}
