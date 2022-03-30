import {
  ContainerModule,
  ContainerModuleBindingService,
} from '@cuaklabs/iocuak';
import { CrudModuleType, ModuleTypeToSymbolMap } from '@cuaklabs/porygon';
import { Repository } from 'typeorm';

import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmCreateContainerModule } from './TypeOrmCreateContainerModule';
import { TypeOrmDeleteContainerModule } from './TypeOrmDeleteContainerModule';
import { TypeOrmReadContainerModule } from './TypeOrmReadContainerModule';
import { TypeOrmUpdateContainerModule } from './TypeOrmUpdateContainerModule';

export class TypeOrmCrudContainerModule<TModelDb> implements ContainerModule {
  readonly #crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  readonly #repository: Repository<TModelDb>;

  readonly #typeOrmCreationContainerModule: ContainerModule;
  readonly #typeOrmDeleteContainerModule: ContainerModule;
  readonly #typeOrmReadContainerModule: ContainerModule;
  readonly #typeOrmUpdateContainerModule: ContainerModule;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
    crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>,
    repository: Repository<TModelDb>,
  ) {
    this.#crudTypeOrmModuleTypeToSymbolMap = crudTypeOrmModuleTypeToSymbolMap;
    this.#repository = repository;

    this.#typeOrmCreationContainerModule = new TypeOrmCreateContainerModule(
      crudModuleTypeToSymbolMap,
      crudTypeOrmModuleTypeToSymbolMap,
    );
    this.#typeOrmDeleteContainerModule = new TypeOrmDeleteContainerModule(
      crudModuleTypeToSymbolMap,
      crudTypeOrmModuleTypeToSymbolMap,
    );
    this.#typeOrmReadContainerModule = new TypeOrmReadContainerModule(
      crudModuleTypeToSymbolMap,
      crudTypeOrmModuleTypeToSymbolMap,
    );
    this.#typeOrmUpdateContainerModule = new TypeOrmUpdateContainerModule(
      crudModuleTypeToSymbolMap,
      crudTypeOrmModuleTypeToSymbolMap,
    );
  }

  public load(
    containerModuleBindingService: ContainerModuleBindingService,
  ): void {
    containerModuleBindingService.bindToValue(
      this.#crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository],
      this.#repository,
    );

    this.#typeOrmCreationContainerModule.load(containerModuleBindingService);
    this.#typeOrmDeleteContainerModule.load(containerModuleBindingService);
    this.#typeOrmReadContainerModule.load(containerModuleBindingService);
    this.#typeOrmUpdateContainerModule.load(containerModuleBindingService);
  }
}
