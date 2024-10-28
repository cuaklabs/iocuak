import { ServiceId } from '@cuaklabs/iocuak-common';

export interface ContainerSingletonService {
  get(serviceId: ServiceId): unknown;
  remove(serviceId: ServiceId): void;
  set(serviceId: ServiceId, value: unknown): void;
}
