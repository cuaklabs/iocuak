import {
  BindingScope,
  ContainerService,
  ContainerModule,
  inject,
  injectable,
  Newable,
  ServiceId,
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

  public load(container: ContainerService): void {
    this.#loadUpdateEntityInteractor(container);
  }

  #loadUpdateEntityInteractor(container: ContainerService): void {
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

    container.bind(this.#updateEntityInteractorType);
  }
}
