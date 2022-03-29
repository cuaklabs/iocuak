import {
  ContainerModule,
  ContainerModuleBindingService,
} from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { DomainCreateContainerModule } from './DomainCreateContainerModule';
import { DomainDeleteContainerModule } from './DomainDeleteContainerModule';
import { DomainReadContainerModule } from './DomainReadContainerModule';
import { DomainUpdateContainerModule } from './DomainUpdateContainerModule';

export class DomainCrudContainerModule implements ContainerModule {
  readonly #domainCreationContainerModule: ContainerModule;
  readonly #domainDeleteContainerModule: ContainerModule;
  readonly #domainReadContainerModule: ContainerModule;
  readonly #domainUpdateContainerModule: ContainerModule;

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

  public load(
    containerModuleBindingService: ContainerModuleBindingService,
  ): void {
    this.#domainCreationContainerModule.load(containerModuleBindingService);
    this.#domainDeleteContainerModule.load(containerModuleBindingService);
    this.#domainReadContainerModule.load(containerModuleBindingService);
    this.#domainUpdateContainerModule.load(containerModuleBindingService);
  }
}
