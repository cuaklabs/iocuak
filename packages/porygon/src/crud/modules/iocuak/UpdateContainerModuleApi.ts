import {
  ContainerApiService,
  ContainerModuleApi,
  inject,
  injectable,
  Newable,
  ServiceId,
  TaskScope,
} from '@cuaklabs/iocuak';

import { UpdateAdapter } from '../../adapter/domain/UpdateAdapter';
import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { Interactor } from '../domain/Interactor';
import { UpdateEntityInteractor } from '../domain/UpdateEntityInteractor';

export class UpdateContainerModuleApi<TQuery> implements ContainerModuleApi {
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #updateEntityInteractorType: Newable<
    Interactor<TQuery, void>,
    [UpdateAdapter<TQuery>]
  >;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
  ) {
    this.#crudModuleTypeToSymbolMap = crudModuleTypeToSymbolMap;

    this.#updateEntityInteractorType = class extends (
      UpdateEntityInteractor
    )<TQuery> {};
  }

  public load(container: ContainerApiService): void {
    this.#loadUpdateEntityInteractor(container);
  }

  #loadUpdateEntityInteractor(container: ContainerApiService): void {
    const updateEntityInteractorServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.updateEntityInteractor];

    injectable({
      id: updateEntityInteractorServiceId,
      scope: TaskScope.singleton,
    })(this.#updateEntityInteractorType);

    inject(CrudModuleType.updateEntityAdapter)(
      this.#updateEntityInteractorType,
      undefined as unknown as string | symbol,
      0,
    );

    container.bind(this.#updateEntityInteractorType);
  }
}
