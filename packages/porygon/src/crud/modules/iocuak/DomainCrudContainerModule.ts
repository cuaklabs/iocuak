import * as iocuak from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { DomainCreateContainerModule } from './DomainCreateContainerModule';
import { DomainDeleteContainerModule } from './DomainDeleteContainerModule';
import { DomainReadContainerModule } from './DomainReadContainerModule';
import { DomainUpdateContainerModule } from './DomainUpdateContainerModule';

export class DomainCrudContainerModule implements iocuak.ContainerModule {
  readonly #domainCreationContainerModule: iocuak.ContainerModule;
  readonly #domainDeleteContainerModule: iocuak.ContainerModule;
  readonly #domainReadContainerModule: iocuak.ContainerModule;
  readonly #domainUpdateContainerModule: iocuak.ContainerModule;

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

  public static forRoot(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
  ): iocuak.ContainerModuleMetadata {
    return {
      factory: () => new DomainCrudContainerModule(crudModuleTypeToSymbolMap),
    };
  }

  public load(
    containerModuleBindingService: iocuak.ContainerModuleBindingService,
  ): void {
    this.#domainCreationContainerModule.load(containerModuleBindingService);
    this.#domainDeleteContainerModule.load(containerModuleBindingService);
    this.#domainReadContainerModule.load(containerModuleBindingService);
    this.#domainUpdateContainerModule.load(containerModuleBindingService);
  }
}
