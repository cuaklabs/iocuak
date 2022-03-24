import { Binding } from '../../../binding/models/domain/Binding';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerBindingService } from './ContainerBindingService';

export class ContainerBindingServiceImplementation
  implements ContainerBindingService
{
  readonly #parent: ContainerBindingService | undefined;
  readonly #serviceIdToBindingMap: Map<ServiceId, Binding>;

  constructor(parent?: ContainerBindingService) {
    this.#parent = parent;
    this.#serviceIdToBindingMap = new Map();
  }

  public get<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
  ): Binding<TInstance, TArgs> | undefined {
    const bindingFromMap: Binding<TInstance, TArgs> | undefined =
      this.#serviceIdToBindingMap.get(serviceId) as
        | Binding<TInstance, TArgs>
        | undefined;

    const binding: Binding<TInstance, TArgs> | undefined =
      bindingFromMap ?? this.#parent?.get<TInstance, TArgs>(serviceId);

    return binding;
  }

  public getAll(): Map<ServiceId, Binding> {
    const serviceIdToBindingMap: Map<ServiceId, Binding> =
      this.#parent === undefined
        ? new Map<ServiceId, Binding>()
        : this.#parent.getAll();

    for (const [serviceId, binding] of this.#serviceIdToBindingMap) {
      serviceIdToBindingMap.set(serviceId, binding);
    }

    return serviceIdToBindingMap;
  }

  public remove(serviceId: ServiceId): void {
    this.#serviceIdToBindingMap.delete(serviceId);
  }

  public set<TInstance, TArgs extends unknown[]>(
    binding: Binding<TInstance, TArgs>,
  ): void {
    this.#serviceIdToBindingMap.set(binding.id, binding as Binding);
  }
}
