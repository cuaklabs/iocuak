import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerSingletonService } from './ContainerSingletonService';

export class ContainerSingletonServiceImplementation
  implements ContainerSingletonService
{
  readonly #serviceIdToInstanceMap: Map<ServiceId, unknown>;

  constructor() {
    this.#serviceIdToInstanceMap = new Map();
  }

  public get<TInstance>(serviceId: ServiceId): TInstance | undefined {
    return this.#serviceIdToInstanceMap.get(serviceId) as TInstance | undefined;
  }

  public remove(serviceId: ServiceId): void {
    this.#serviceIdToInstanceMap.delete(serviceId);
  }

  public set<TInstance>(serviceId: ServiceId, value: TInstance): void {
    this.#serviceIdToInstanceMap.set(serviceId, value);
  }
}
