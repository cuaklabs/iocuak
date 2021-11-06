import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ContainerRequestService {
  end(requestId: symbol): void;
  get<TInstance>(
    requestId: symbol,
    serviceId: ServiceId,
  ): TInstance | undefined;
  set<TInstance>(
    requestId: symbol,
    serviceId: ServiceId,
    value: TInstance,
  ): void;
  start(): symbol;
}
