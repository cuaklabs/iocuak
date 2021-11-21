import { Binding } from '../../../binding/models/domain/Binding';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerBindingService } from './ContainerBindingService';

export class ContainerBindingServiceImplementation
  implements ContainerBindingService
{
  readonly #serviceIdToBindingMap: Map<ServiceId, Binding>;

  constructor() {
    this.#serviceIdToBindingMap = new Map();
  }

  public get<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
  ): Binding<TInstance, TArgs> | undefined {
    return this.#serviceIdToBindingMap.get(serviceId) as
      | Binding<TInstance, TArgs>
      | undefined;
  }

  public remove(serviceId: ServiceId): void {
    this.#serviceIdToBindingMap.delete(serviceId);
  }

  public set<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
    binding: Binding<TInstance, TArgs>,
  ): void {
    this.#serviceIdToBindingMap.set(serviceId, binding as Binding);
  }
}
