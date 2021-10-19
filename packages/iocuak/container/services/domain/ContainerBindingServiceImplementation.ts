import { Binding } from '../../../binding/models/domain/Binding';
import { ServiceId } from '../../../task/models/domain/ServiceId';
import { ContainerBindingService } from './ContainerBindingService';

export class ContainerBindingServiceImplementation
  implements ContainerBindingService
{
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
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

  public set<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
    binding: Binding<TInstance, TArgs>,
  ): void {
    this.#serviceIdToBindingMap.set(serviceId, binding as Binding);
  }
}
