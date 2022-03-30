import {
  BindingScope,
  ContainerModule,
  inject,
  injectable,
  Newable,
  ServiceId,
  ContainerModuleBindingService,
} from '@cuaklabs/iocuak';

import { InteractorAsync } from '../../../common/modules/domain/InteractorAsync';
import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { UpdateEntityPort } from '../../port/application/UpdateEntityPort';
import { UpdateEntityInteractor } from '../domain/UpdateEntityInteractor';

export class DomainUpdateContainerModule<TQuery> implements ContainerModule {
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #updateEntityInteractorType: Newable<
    InteractorAsync<TQuery, void>,
    [UpdateEntityPort<TQuery>]
  >;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
  ) {
    this.#crudModuleTypeToSymbolMap = crudModuleTypeToSymbolMap;

    this.#updateEntityInteractorType = class extends (
      UpdateEntityInteractor
    )<TQuery> {};
  }

  public load(
    containerModuleBindingService: ContainerModuleBindingService,
  ): void {
    this.#loadUpdateEntityInteractor(containerModuleBindingService);
  }

  #loadUpdateEntityInteractor(
    containerModuleBindingService: ContainerModuleBindingService,
  ): void {
    const updateEntityInteractorServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.updateEntityInteractor];

    injectable({
      id: updateEntityInteractorServiceId,
      scope: BindingScope.singleton,
    })(this.#updateEntityInteractorType);

    const updateEntityAdapterServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.updateEntityAdapter];

    inject(updateEntityAdapterServiceId)(
      this.#updateEntityInteractorType,
      undefined as unknown as string | symbol,
      0,
    );

    containerModuleBindingService.bind(this.#updateEntityInteractorType);
  }
}
