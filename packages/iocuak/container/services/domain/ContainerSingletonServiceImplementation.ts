import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerSingletonService } from './ContainerSingletonService';

export class ContainerSingletonServiceImplementation
  implements ContainerSingletonService
{
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #serviceIdToInstanceMap: Map<ServiceId, unknown>;

  constructor() {
    this.#serviceIdToInstanceMap = new Map();
  }

  public get<TInstance>(serviceId: ServiceId): TInstance | undefined {
    return this.#serviceIdToInstanceMap.get(serviceId) as TInstance | undefined;
  }

  public set<TInstance>(serviceId: ServiceId, value: TInstance): void {
    this.#serviceIdToInstanceMap.set(serviceId, value);
  }
}
