import { ServiceId } from '@cuaklabs/iocuak-common';

import { ContainerRequestService } from './ContainerRequestService';

export class ContainerRequestServiceImplementation
  implements ContainerRequestService
{
  readonly #requestIdToServiceIdToServiceMapMap: Map<
    symbol,
    Map<ServiceId, unknown>
  >;

  constructor() {
    this.#requestIdToServiceIdToServiceMapMap = new Map();
  }

  public end(requestId: symbol): void {
    const requestExists: boolean =
      this.#requestIdToServiceIdToServiceMapMap.delete(requestId);

    if (!requestExists) {
      throw new Error(
        'Error trying to end request. No request with the id provided was found',
      );
    }
  }

  public get(requestId: symbol, serviceId: ServiceId): unknown {
    const serviceIdToServiceMap: Map<ServiceId, unknown> =
      this.#getServiceIdToServiceMap(requestId);

    const service: unknown = serviceIdToServiceMap.get(serviceId);

    return service;
  }

  public set(requestId: symbol, serviceId: ServiceId, value: unknown): void {
    const serviceIdToServiceMap: Map<ServiceId, unknown> =
      this.#getServiceIdToServiceMap(requestId);

    serviceIdToServiceMap.set(serviceId, value);
  }

  public start(): symbol {
    const requestId: symbol = Symbol();

    this.#requestIdToServiceIdToServiceMapMap.set(requestId, new Map());

    return requestId;
  }

  #getServiceIdToServiceMap(requestId: symbol): Map<ServiceId, unknown> {
    const serviceIdToServiceMap: Map<ServiceId, unknown> | undefined =
      this.#requestIdToServiceIdToServiceMapMap.get(requestId);

    if (serviceIdToServiceMap === undefined) {
      throw new Error(
        'Error trying to get service. No request with the id provided was found',
      );
    } else {
      return serviceIdToServiceMap;
    }
  }
}
