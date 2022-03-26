import {
  ContainerServiceApi,
  ContainerModuleApi,
  inject,
  injectable,
  Newable,
  ServiceId,
  TaskScopeApi,
} from '@cuaklabs/iocuak';

import { InteractorAsync } from '../../../common/modules/domain/InteractorAsync';
import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { CreateEntityPort } from '../../port/application/CreateEntityPort';
import { CreateEntityInteractor } from '../domain/CreateEntityInteractor';

export class DomainCreateContainerModuleApi<TModel, TQuery>
  implements ContainerModuleApi
{
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #createEntityInteractorType: Newable<
    InteractorAsync<TQuery, TModel>,
    [CreateEntityPort<TModel, TQuery>]
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

  public load(container: ContainerServiceApi): void {
    this.#loadCreateEntityInteractor(container);
  }

  #loadCreateEntityInteractor(container: ContainerServiceApi): void {
    const createEntityInteractorServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.createEntityInteractor];

    const createEntityAdapterServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.createEntityAdapter];

    injectable({
      id: createEntityInteractorServiceId,
      scope: TaskScopeApi.singleton,
    })(this.#createEntityInteractorType);

    inject(createEntityAdapterServiceId)(
      this.#createEntityInteractorType,
      undefined as unknown as string | symbol,
      0,
    );

    container.bind(this.#createEntityInteractorType);
  }
}
