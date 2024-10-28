import { ServiceId } from '@cuaklabs/iocuak-common';

export interface ContainerRequestService {
  end(requestId: symbol): void;
  get(requestId: symbol, serviceId: ServiceId): unknown;
  set(requestId: symbol, serviceId: ServiceId, value: unknown): void;
  start(): symbol;
}
