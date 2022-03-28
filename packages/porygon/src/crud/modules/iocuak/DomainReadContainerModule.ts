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
import { FindEntityPort } from '../../port/application/FindEntityPort';
import { ReadManyEntityInteractor } from '../domain/ReadManyEntityInteractor';
import { ReadOneEntityInteractor } from '../domain/ReadOneEntityInteractor';

export class DomainReadContainerModule<TModel, TQuery>
  implements ContainerModule
{
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #readManyEntityInteractorType: Newable<
    InteractorAsync<TQuery, TModel[]>,
    [FindEntityPort<TModel, TQuery>]
  >;
  readonly #readOneEntityInteractorType: Newable<
    InteractorAsync<TQuery, TModel | undefined>,
    [FindEntityPort<TModel, TQuery>]
  >;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
  ) {
    this.#crudModuleTypeToSymbolMap = crudModuleTypeToSymbolMap;
    this.#readManyEntityInteractorType = class extends ReadManyEntityInteractor<
      TModel,
      TQuery
    > {};
    this.#readOneEntityInteractorType = class extends ReadOneEntityInteractor<
      TModel,
      TQuery
    > {};
  }

  public load(container: ContainerService): void {
    this.#loadReadOneEntityInteractor(container);
    this.#loadReadManyEntityInteractor(container);
  }

  #loadReadOneEntityInteractor(container: ContainerService): void {
    const readOneEntityInteractorServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.readOneEntityInteractor];

    injectable({
      id: readOneEntityInteractorServiceId,
      scope: BindingScope.singleton,
    })(this.#readOneEntityInteractorType);

    const readEntityAdapterServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.readEntityAdapter];

    inject(readEntityAdapterServiceId)(
      this.#readOneEntityInteractorType,
      undefined as unknown as string | symbol,
      0,
    );

    container.bind(this.#readOneEntityInteractorType);
  }

  #loadReadManyEntityInteractor(container: ContainerService): void {
    const readManyEntityInteractorServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.readManyEntityInteractor];

    injectable({
      id: readManyEntityInteractorServiceId,
      scope: BindingScope.singleton,
    })(this.#readManyEntityInteractorType);

    const readEntityAdapterServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.readEntityAdapter];

    inject(readEntityAdapterServiceId)(
      this.#readManyEntityInteractorType,
      undefined as unknown as string | symbol,
      0,
    );

    container.bind(this.#readManyEntityInteractorType);
  }
}
