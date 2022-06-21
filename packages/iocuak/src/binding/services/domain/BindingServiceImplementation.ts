import { Binding } from '../../../binding/models/domain/Binding';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { chain } from '../../../common/utils/chain';
import { BindingTag } from '../../models/domain/BindingTag';
import { removeBindingDuplicates } from '../../utils/domain/removeBindingDuplicates';

export class BindingServiceImplementation implements BindingService {
  readonly #parent: BindingService | undefined;
  readonly #serviceIdToBindingMap: Map<ServiceId, Binding>;
  readonly #tagToBindingsMap: Map<BindingTag, Map<ServiceId, Binding>>;

  constructor(parent?: BindingService) {
    this.#parent = parent;
    this.#serviceIdToBindingMap = new Map();
    this.#tagToBindingsMap = new Map();
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

  public getByTag(
    tag: BindingTag,
    removeDuplicates: boolean,
  ): Iterable<Binding> {
    if (removeDuplicates) {
      const duplicatedServices: Iterable<Binding<unknown, unknown[]>> =
        this.getByTag(tag, false);

      return removeBindingDuplicates(duplicatedServices);
    } else {
      let bindingIterable: Iterable<Binding> =
        this.#tagToBindingsMap.get(tag)?.values() ?? [];

      if (this.#parent !== undefined) {
        bindingIterable = chain(
          this.#parent.getByTag(tag, false),
          bindingIterable,
        );
      }

      return bindingIterable;
    }
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

    this.#setBindingTags(binding as Binding);
  }

  #setBindingTags(binding: Binding): void {
    for (const tag of binding.tags) {
      let tagBindings: Map<ServiceId, Binding> | undefined =
        this.#tagToBindingsMap.get(tag);

      if (tagBindings === undefined) {
        tagBindings = new Map();
        this.#tagToBindingsMap.set(tag, tagBindings);
      }

      tagBindings.set(binding.id, binding);
    }
  }
}
