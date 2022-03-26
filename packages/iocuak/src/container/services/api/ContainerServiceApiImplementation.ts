import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BindingApi } from '../../../metadata/models/api/BindingApi';
import { Binding } from '../../../metadata/models/domain/Binding';
import { BindingType } from '../../../metadata/models/domain/BindingType';
import { TypeBinding } from '../../../metadata/models/domain/TypeBinding';
import { ValueBinding } from '../../../metadata/models/domain/ValueBinding';
import { convertBindingToBindingApi } from '../../../metadata/utils/api/convertBindingToBindingApi';
import { ContainerModuleApi } from '../../modules/api/ContainerModuleApi';
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
    const bindingFromType: TypeBinding<TInstance, TArgs> | undefined =
      this._containerService.metadata.getBindingMetadata(type);

    if (bindingFromType === undefined) {
      throw new Error(
        `No bindings found for type ${type.name}. An @injectable() decorator may be missing`,
      );
    } else {
      this._containerService.binding.set(bindingFromType);
    }
  }

  public bindToValue<TInstance>(serviceId: ServiceId, value: TInstance): void {
    const valueBinding: ValueBinding<TInstance> = {
      bindingType: BindingType.value,
      id: serviceId,
      value: value,
    };

    this._containerService.binding.set(valueBinding);
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

  public unbind(serviceId: ServiceId): void {
    this._containerService.binding.remove(serviceId);
  }
}
