import { BindingApi } from '../../../binding/models/api/BindingApi';
import { Binding } from '../../../binding/models/domain/Binding';
import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { convertToContainerModuleMetadata } from '../../../containerModuleMetadata/actions/api/convertToContainerModuleMetadata';
import { ContainerModuleMetadataApi } from '../../../containerModuleMetadata/models/api/ContainerModuleMetadataApi';
import { ContainerModuleMetadata } from '../../../containerModuleMetadata/models/domain/ContainerModuleMetadata';
import { createInstance } from '../../../task/actions/domain/createInstance';
import { createInstanceFromBinding } from '../../../task/actions/domain/createInstanceFromBinding';
import { createInstancesByTag } from '../../../task/actions/domain/createInstancesByTag';
import { getDependencies } from '../../../task/actions/domain/getDependencies';
import { loadContainerModule } from '../../../task/actions/domain/loadContainerModule';
import { TaskContext } from '../../../task/models/domain/TaskContext';
import { BindValueOptionsApi } from '../../models/api/BindValueOptionsApi';
import { bind } from '../../utils/bind';
import { bindToValue } from '../../utils/bindToValue';
import { ContainerService } from '../domain/ContainerService';
import { ContainerServiceApi } from './ContainerServiceApi';

export class ContainerServiceApiImplementation implements ContainerServiceApi {
  protected readonly _containerService: ContainerService;

  constructor(containerService: ContainerService) {
    this._containerService = containerService;
  }

  public bind<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): void {
    bind(type, this._containerService.binding, this._containerService.metadata);
  }

  public bindToValue(options: BindValueOptionsApi): void {
    bindToValue(
      options.serviceId,
      this.#getTags(options),
      options.value,
      this._containerService.binding,
    );
  }

  public get<TInstance>(serviceId: ServiceId): TInstance {
    const requestId: symbol = this._containerService.request.start();

    const context: TaskContext = this.#createTaskContext(requestId);

    const instance: TInstance = createInstance(serviceId, context) as TInstance;

    this._containerService.request.end(context.requestId);

    return instance;
  }

  public getByTag<TInstances extends unknown[] = unknown[]>(
    tag: BindingTag,
  ): TInstances {
    const requestId: symbol = this._containerService.request.start();

    const context: TaskContext = this.#createTaskContext(requestId);

    const instances: TInstances = createInstancesByTag(
      tag,
      context,
    ) as TInstances;

    this._containerService.request.end(context.requestId);

    return instances;
  }

  public getAllBindinds(): BindingApi[] {
    const serviceIdToBindingMap: Map<ServiceId, Binding> =
      this._containerService.binding.getAll();

    const bindings: Binding[] = [...serviceIdToBindingMap.values()];

    return bindings.map((binding: Binding) =>
      convertBindingToBindingApi(binding),
    );
  }

  public load(containerModuleApi: ContainerModuleApi): void {
    containerModuleApi.load(this);
  }

  public async loadMetadata(
    containerModuleMetadataApi: ContainerModuleMetadataApi,
  ): Promise<void> {
    const requestId: symbol = this._containerService.request.start();

    const containerModuleMetadata: ContainerModuleMetadata =
      convertToContainerModuleMetadata(containerModuleMetadataApi);

    const context: TaskContext = this.#createTaskContext(requestId);

    await loadContainerModule(containerModuleMetadata, context);

    this._containerService.request.end(context.requestId);
  }

  public unbind(serviceId: ServiceId): void {
    this._containerService.singleton.remove(serviceId);
    this._containerService.binding.remove(serviceId);
  }

  #createTaskContext(requestId: symbol): TaskContext {
    const context: TaskContext = {
      actions: {
        createInstanceFromBinding,
        getDependencies,
      },
      requestId: requestId,
      services: {
        bindingService: this._containerService.binding,
        containerRequestService: this._containerService.request,
        containerSingletonService: this._containerService.singleton,
        metadataService: this._containerService.metadata,
      },
      servicesInstantiatedSet: new Set(),
    };

    return context;
  }

  #getTags(options: BindValueOptionsApi): BindingTag[] {
    const tagOrTags: BindingTag | BindingTag[] = options?.tags ?? [];

    let tags: BindingTag[];

    if (Array.isArray(tagOrTags)) {
      tags = tagOrTags;
    } else {
      tags = [tagOrTags];
    }

    return tags;
  }
}
