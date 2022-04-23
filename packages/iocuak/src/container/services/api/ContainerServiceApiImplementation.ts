import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleMetadataApi } from '../../../containerModuleTask/models/api/ContainerModuleMetadataApi';
import { ContainerModuleMetadata } from '../../../containerModuleTask/models/domain/ContainerModuleMetadata';
import { convertToContainerModuleMetadata } from '../../../containerModuleTask/utils/convertToContainerModuleMetadata';
import { BindingApi } from '../../../metadata/models/api/BindingApi';
import { Binding } from '../../../metadata/models/domain/Binding';
import { convertBindingToBindingApi } from '../../../metadata/utils/api/convertBindingToBindingApi';
import { ContainerModuleApi } from '../../modules/api/ContainerModuleApi';
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

  public bindToValue<TInstance>(serviceId: ServiceId, value: TInstance): void {
    bindToValue(serviceId, value, this._containerService.binding);
  }

  public get<TInstance>(serviceId: ServiceId): TInstance {
    const instance: TInstance =
      this._containerService.instance.create(serviceId);

    return instance;
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
    const containerModuleMetadata: ContainerModuleMetadata =
      convertToContainerModuleMetadata(containerModuleMetadataApi);

    await this._containerService.module.loadMetadata(containerModuleMetadata);
  }

  public unbind(serviceId: ServiceId): void {
    this._containerService.singleton.remove(serviceId);
    this._containerService.binding.remove(serviceId);
  }
}
