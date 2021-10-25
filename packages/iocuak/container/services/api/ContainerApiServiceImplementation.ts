import { Binding } from '../../../binding/models/domain/Binding';
import { Newable } from '../../../task/models/domain/Newable';
import { ServiceId } from '../../../task/models/domain/ServiceId';
import { ContainerModuleApi } from '../../modules/api/ContainerModuleApi';
import { ContainerService } from '../domain/ContainerService';
import { ContainerApiService } from './ContainerApiService';

export class ContainerApiServiceImplementation implements ContainerApiService {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #containerService: ContainerService;

  constructor(containerService: ContainerService) {
    this.#containerService = containerService;
  }

  public bind<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): void {
    const bindingFromType: Binding<TInstance, TArgs> | undefined =
      this.#containerService.metadata.getBindingMetadata(type);

    if (bindingFromType === undefined) {
      throw new Error(
        `No bindings found for type ${type.name}. An @injectable() decorator may be missing`,
      );
    } else {
      this.#containerService.binding.set(bindingFromType.id, bindingFromType);
    }
  }

  public get<TInstance>(serviceId: ServiceId): TInstance {
    const instance: TInstance =
      this.#containerService.instance.create(serviceId);

    return instance;
  }

  public load(containerModuleApi: ContainerModuleApi): void {
    containerModuleApi.load(this);
  }

  public unbind(serviceId: ServiceId): void {
    this.#containerService.binding.remove(serviceId);
  }
}
