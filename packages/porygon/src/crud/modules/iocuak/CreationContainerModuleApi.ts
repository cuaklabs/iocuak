import {
  ContainerApiService,
  ContainerModuleApi,
  inject,
  injectable,
  Newable,
  ServiceId,
  TaskScope,
} from '@cuaklabs/iocuak';

import { CreateAdapter } from '../../adapter/domain/CreateAdapter';
import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { CreateEntityInteractor } from '../domain/CreateEntityInteractor';
import { InteractorAsync } from '../domain/InteractorAsync';

export class CreationContainerModuleApi<TModel, TQuery>
  implements ContainerModuleApi
{
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #createEntityInteractorType: Newable<
    InteractorAsync<TQuery, TModel>,
    [CreateAdapter<TModel, TQuery>]
  >;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
  ) {
    this.#crudModuleTypeToSymbolMap = crudModuleTypeToSymbolMap;

    this.#createEntityInteractorType = class extends CreateEntityInteractor<
      TModel,
      TQuery
    > {};
  }

  public load(container: ContainerApiService): void {
    this.#loadCreateEntityInteractor(container);
  }

  #loadCreateEntityInteractor(container: ContainerApiService): void {
    const createEntityInteractorServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.createEntityInteractor];

    injectable({
      id: createEntityInteractorServiceId,
      scope: TaskScope.singleton,
    })(this.#createEntityInteractorType);

    inject(CrudModuleType.createEntityAdapter)(
      this.#createEntityInteractorType,
      undefined as unknown as string | symbol,
      0,
    );

    container.bind(this.#createEntityInteractorType);
  }
}
