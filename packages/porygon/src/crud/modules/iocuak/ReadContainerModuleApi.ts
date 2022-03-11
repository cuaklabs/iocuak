import {
  ContainerApiService,
  ContainerModuleApi,
  inject,
  injectable,
  Newable,
  ServiceId,
  TaskScope,
} from '@cuaklabs/iocuak';

import { FindAdapter } from '../../adapter/domain/FindAdapter';
import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { Interactor } from '../domain/Interactor';
import { ReadManyInteractor } from '../domain/ReadManyInteractor';
import { ReadOneInteractor } from '../domain/ReadOneInteractor';

export class ReadContainerModuleApi<TModel, TQuery>
  implements ContainerModuleApi
{
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #readManyEntityInteractorType: Newable<
    Interactor<TQuery, TModel[]>,
    [FindAdapter<TModel, TQuery>]
  >;
  readonly #readOneEntityInteractorType: Newable<
    Interactor<TQuery, TModel | undefined>,
    [FindAdapter<TModel, TQuery>]
  >;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
  ) {
    this.#crudModuleTypeToSymbolMap = crudModuleTypeToSymbolMap;
    this.#readManyEntityInteractorType = class extends ReadManyInteractor<
      TModel,
      TQuery
    > {};
    this.#readOneEntityInteractorType = class extends ReadOneInteractor<
      TModel,
      TQuery
    > {};
  }

  public load(container: ContainerApiService): void {
    this.#loadReadOneEntityInteractor(container);
    this.#loadReadManyEntityInteractor(container);
  }

  #loadReadOneEntityInteractor(container: ContainerApiService): void {
    const readOneEntityInteractorServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.readOneEntityInteractor];

    injectable({
      id: readOneEntityInteractorServiceId,
      scope: TaskScope.singleton,
    })(this.#readOneEntityInteractorType);

    inject(CrudModuleType.readEntityAdapter)(
      this.#readOneEntityInteractorType,
      undefined as unknown as string | symbol,
      0,
    );

    container.bind(this.#readOneEntityInteractorType);
  }

  #loadReadManyEntityInteractor(container: ContainerApiService): void {
    const readManyEntityInteractorServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.readManyEntityInteractor];

    injectable({
      id: readManyEntityInteractorServiceId,
      scope: TaskScope.singleton,
    })(this.#readManyEntityInteractorType);

    inject(CrudModuleType.readEntityAdapter)(
      this.#readManyEntityInteractorType,
      undefined as unknown as string | symbol,
      0,
    );

    container.bind(this.#readManyEntityInteractorType);
  }
}
