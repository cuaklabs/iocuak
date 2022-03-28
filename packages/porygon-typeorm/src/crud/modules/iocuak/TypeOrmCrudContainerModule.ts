import { ContainerService, ContainerModule } from '@cuaklabs/iocuak';
import { CrudModuleType, ModuleTypeToSymbolMap } from '@cuaklabs/porygon';
import { Repository } from 'typeorm';

import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmCreateContainerModule } from './TypeOrmCreateContainerModule';
import { TypeOrmDeleteContainerModule } from './TypeOrmDeleteContainerModule';
import { TypeOrmReadContainerModule } from './TypeOrmReadContainerModule';
import { TypeOrmUpdateContainerModule } from './TypeOrmUpdateContainerModule';

export class TypeOrmCrudContainerModule<TModel, TModelDb, TQuery>
  implements ContainerModule
{
  readonly #crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  readonly #repository: Repository<TModelDb>;

  readonly #typeOrmCreationContainerModule: TypeOrmCreateContainerModule<
    TModel,
    TModelDb,
    TQuery
  >;
  readonly #typeOrmDeleteContainerModule: TypeOrmDeleteContainerModule<
    TModelDb,
    TQuery
  >;
  readonly #typeOrmReadContainerModule: TypeOrmReadContainerModule<
    TModel,
    TModelDb,
    TQuery
  >;
  readonly #typeOrmUpdateContainerModule: TypeOrmUpdateContainerModule<
    TModelDb,
    TQuery
  >;

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

  public load(container: ContainerService): void {
    container.bindToValue(
      this.#crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository],
      this.#repository,
    );

    this.#typeOrmCreationContainerModule.load(container);
    this.#typeOrmDeleteContainerModule.load(container);
    this.#typeOrmReadContainerModule.load(container);
    this.#typeOrmUpdateContainerModule.load(container);
  }
}
