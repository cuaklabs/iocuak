import { Newable, ServiceId, Tag } from '@cuaklabs/iocuak-common';
import {
  bind,
  bindToValue,
  createInstance,
  createInstancesByTag,
  CreateInstanceTaskContext,
  ContainerModuleMetadata,
  createCreateInstanceTaskContext,
  LoadModuleMetadataTaskContext,
  loadContainerModuleMetadata,
  TaskContextServices,
} from '@cuaklabs/iocuak-core';
import { Binding, BindOptions } from '@cuaklabs/iocuak-models';
import { BindingApi, BindOptionsApi } from '@cuaklabs/iocuak-models-api';

import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { convertToBindOptions } from '../../../binding/utils/api/convertToBindOptions';
import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { convertToContainerModuleMetadata } from '../../../containerModuleMetadata/actions/api/convertToContainerModuleMetadata';
import { ContainerModuleMetadataApi } from '../../../containerModuleMetadata/models/api/ContainerModuleMetadataApi';
import { BindValueOptionsApi } from '../../models/api/BindValueOptionsApi';
import { ContainerService } from '../domain/ContainerService';
import { ContainerServiceApi } from './ContainerServiceApi';

export class ContainerServiceApiImplementation implements ContainerServiceApi {
  protected readonly _containerService: ContainerService;

  readonly #taskContextServices: TaskContextServices;

  constructor(containerService: ContainerService) {
    this._containerService = containerService;

    this.#taskContextServices = {
      bindingService: this._containerService.binding,
      containerRequestService: this._containerService.request,
      containerSingletonService: this._containerService.singleton,
    };
  }

  public bind<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
    options?: BindOptionsApi,
  ): void {
    const bindOptions: BindOptions = convertToBindOptions(options);

    bind(type, bindOptions, this._containerService.binding);
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

    const context: CreateInstanceTaskContext =
      this.#createInstanceTaskContext(requestId);

    const instance: TInstance = createInstance(serviceId, context) as TInstance;

    this._containerService.request.end(context.requestId);

    return instance;
  }

  public getByTag<TInstances extends unknown[] = unknown[]>(
    tag: Tag,
  ): TInstances {
    const requestId: symbol = this._containerService.request.start();

    const context: CreateInstanceTaskContext =
      this.#createInstanceTaskContext(requestId);

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

    const context: LoadModuleMetadataTaskContext =
      new LoadModuleMetadataTaskContext(
        this.#createInstanceTaskContext(requestId),
        [containerModuleMetadata],
      );

    await loadContainerModuleMetadata(containerModuleMetadata, context);

    this._containerService.request.end(
      context.createInstanceTaskContext.requestId,
    );
  }

  public unbind(serviceId: ServiceId): void {
    this._containerService.singleton.remove(serviceId);
    this._containerService.binding.remove(serviceId);
  }

  #createInstanceTaskContext(requestId: symbol): CreateInstanceTaskContext {
    const context: CreateInstanceTaskContext = createCreateInstanceTaskContext(
      requestId,
      this.#taskContextServices,
    );

    return context;
  }

  #getTags(options: BindValueOptionsApi): Tag[] {
    const tagOrTags: Tag | Tag[] = options?.tags ?? [];

    let tags: Tag[];

    if (Array.isArray(tagOrTags)) {
      tags = tagOrTags;
    } else {
      tags = [tagOrTags];
    }

    return tags;
  }
}
