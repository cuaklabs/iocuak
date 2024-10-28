import { ServiceId } from '@cuaklabs/iocuak-common';

import { ContainerSingletonService } from './ContainerSingletonService';

export class ContainerSingletonServiceImplementation
  implements ContainerSingletonService
{
  readonly #serviceIdToInstanceMap: Map<ServiceId, unknown>;

  constructor() {
    this.#serviceIdToInstanceMap = new Map();
  }

  public get(serviceId: ServiceId): unknown {
    return this.#serviceIdToInstanceMap.get(serviceId);
  }

  public remove(serviceId: ServiceId): void {
    this.#serviceIdToInstanceMap.delete(serviceId);
  }

  public set(serviceId: ServiceId, value: unknown): void {
    this.#serviceIdToInstanceMap.set(serviceId, value);
  }
}
