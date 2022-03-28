import { ContainerService, ContainerModule } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { DomainCreateContainerModule } from './DomainCreateContainerModule';
import { DomainDeleteContainerModule } from './DomainDeleteContainerModule';
import { DomainReadContainerModule } from './DomainReadContainerModule';
import { DomainUpdateContainerModule } from './DomainUpdateContainerModule';

export class DomainCrudContainerModule<TModel, TQuery>
  implements ContainerModule
{
  readonly #domainCreationContainerModule: DomainCreateContainerModule<
    TModel,
    TQuery
  >;
  readonly #domainDeleteContainerModule: DomainDeleteContainerModule<TQuery>;
  readonly #domainReadContainerModule: DomainReadContainerModule<
    TModel,
    TQuery
  >;
  readonly #domainUpdateContainerModule: DomainUpdateContainerModule<TQuery>;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
  ) {
    this.#domainCreationContainerModule = new DomainCreateContainerModule(
      crudModuleTypeToSymbolMap,
    );
    this.#domainDeleteContainerModule = new DomainDeleteContainerModule(
      crudModuleTypeToSymbolMap,
    );
    this.#domainReadContainerModule = new DomainReadContainerModule(
      crudModuleTypeToSymbolMap,
    );
    this.#domainUpdateContainerModule = new DomainUpdateContainerModule(
      crudModuleTypeToSymbolMap,
    );
  }

  public load(container: ContainerService): void {
    this.#domainCreationContainerModule.load(container);
    this.#domainDeleteContainerModule.load(container);
    this.#domainReadContainerModule.load(container);
    this.#domainUpdateContainerModule.load(container);
  }
}
