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
import { CreateEntityPort } from '../../port/application/CreateEntityPort';
import { CreateEntityInteractor } from '../domain/CreateEntityInteractor';

export class DomainCreateContainerModule<TModel, TQuery>
  implements ContainerModule
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

  public load(
    containerModuleBindingService: ContainerModuleBindingService,
  ): void {
    this.#loadCreateEntityInteractor(containerModuleBindingService);
  }

  #loadCreateEntityInteractor(
    containerModuleBindingService: ContainerModuleBindingService,
  ): void {
    const createEntityInteractorServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.createEntityInteractor];

    const createEntityAdapterServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.createEntityAdapter];

    injectable({
      id: createEntityInteractorServiceId,
      scope: BindingScope.singleton,
    })(this.#createEntityInteractorType);

    inject(createEntityAdapterServiceId)(
      this.#createEntityInteractorType,
      undefined as unknown as string | symbol,
      0,
    );

    containerModuleBindingService.bind(this.#createEntityInteractorType);
  }
}
