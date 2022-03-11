import {
  ContainerApiService,
  ContainerModuleApi,
  inject,
  injectable,
  Newable,
  ServiceId,
  TaskScope,
} from '@cuaklabs/iocuak';

import { DeleteAdapter } from '../../adapter/domain/DeleteAdapter';
import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { DeleteEntityInteractor } from '../domain/DeleteEntityInteractor';
import { Interactor } from '../domain/Interactor';

export class DeleteContainerModuleApi<TQuery> implements ContainerModuleApi {
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #deleteEntityInteractorType: Newable<
    Interactor<TQuery, void>,
    [DeleteAdapter<TQuery>]
  >;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
  ) {
    this.#crudModuleTypeToSymbolMap = crudModuleTypeToSymbolMap;

    this.#deleteEntityInteractorType = class extends (
      DeleteEntityInteractor
    )<TQuery> {};
  }

  public load(container: ContainerApiService): void {
    this.#loadDeleteEntityInteractor(container);
  }

  #loadDeleteEntityInteractor(container: ContainerApiService): void {
    const deleteEntityInteractorServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.deleteEntityInteractor];

    injectable({
      id: deleteEntityInteractorServiceId,
      scope: TaskScope.singleton,
    })(this.#deleteEntityInteractorType);

    inject(CrudModuleType.deleteEntityAdapter)(
      this.#deleteEntityInteractorType,
      undefined as unknown as string | symbol,
      0,
    );

    container.bind(this.#deleteEntityInteractorType);
  }
}
