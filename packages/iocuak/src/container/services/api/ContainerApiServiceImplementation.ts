import { BindingType } from '../../../binding/models/domain/BindingType';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ValueBinding } from '../../../binding/models/domain/ValueBinding';
import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../modules/api/ContainerModuleApi';
import { ContainerService } from '../domain/ContainerService';
import { ContainerApiService } from './ContainerApiService';

export class ContainerApiServiceImplementation implements ContainerApiService {
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

  public load(containerModuleApi: ContainerModuleApi): void {
    containerModuleApi.load(this);
  }

  public unbind(serviceId: ServiceId): void {
    this._containerService.binding.remove(serviceId);
  }
}
