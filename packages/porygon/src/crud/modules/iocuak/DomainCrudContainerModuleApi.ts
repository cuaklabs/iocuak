import { ContainerApiService, ContainerModuleApi } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { DomainCreateContainerModuleApi } from './DomainCreateContainerModuleApi';
import { DomainDeleteContainerModuleApi } from './DomainDeleteContainerModuleApi';
import { DomainReadContainerModuleApi } from './DomainReadContainerModuleApi';
import { DomainUpdateContainerModuleApi } from './DomainUpdateContainerModuleApi';

export class DomainCrudContainerModuleApi<TModel, TQuery>
  implements ContainerModuleApi
{
  readonly #domainCreationContainerModuleApi: DomainCreateContainerModuleApi<
    TModel,
    TQuery
  >;
  readonly #domainDeleteContainerModuleApi: DomainDeleteContainerModuleApi<TQuery>;
  readonly #domainReadContainerModuleApi: DomainReadContainerModuleApi<
    TModel,
    TQuery
  >;
  readonly #domainUpdateContainerModuleApi: DomainUpdateContainerModuleApi<TQuery>;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
  ) {
    this.#domainCreationContainerModuleApi = new DomainCreateContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
    this.#domainDeleteContainerModuleApi = new DomainDeleteContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
    this.#domainReadContainerModuleApi = new DomainReadContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
    this.#domainUpdateContainerModuleApi = new DomainUpdateContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
  }

  public load(container: ContainerApiService): void {
    this.#domainCreationContainerModuleApi.load(container);
    this.#domainDeleteContainerModuleApi.load(container);
    this.#domainReadContainerModuleApi.load(container);
    this.#domainUpdateContainerModuleApi.load(container);
  }
}
