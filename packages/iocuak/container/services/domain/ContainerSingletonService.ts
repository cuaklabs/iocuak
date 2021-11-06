import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ContainerSingletonService {
  get<TInstance>(serviceId: ServiceId): TInstance | undefined;
  set<TInstance>(serviceId: ServiceId, value: TInstance): void;
}
