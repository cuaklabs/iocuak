import { ContainerApiService, ContainerModuleApi } from '@cuaklabs/iocuak';
import { CrudModuleType, ModuleTypeToSymbolMap } from '@cuaklabs/porygon';
import { Repository } from 'typeorm';

import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmCreateContainerModuleApi } from './TypeOrmCreateContainerModuleApi';
import { TypeOrmDeleteContainerModuleApi } from './TypeOrmDeleteContainerModuleApi';
import { TypeOrmReadContainerModuleApi } from './TypeOrmReadContainerModuleApi';
import { TypeOrmUpdateContainerModuleApi } from './TypeOrmUpdateContainerModuleApi';

export class TypeOrmCrudContainerModuleApi<TModel, TModelDb, TQuery>
  implements ContainerModuleApi
{
  readonly #crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  readonly #repository: Repository<TModelDb>;

  readonly #typeOrmCreationContainerModuleApi: TypeOrmCreateContainerModuleApi<
    TModel,
    TModelDb,
    TQuery
  >;
  readonly #typeOrmDeleteContainerModuleApi: TypeOrmDeleteContainerModuleApi<
    TModelDb,
    TQuery
  >;
  readonly #typeOrmReadContainerModuleApi: TypeOrmReadContainerModuleApi<
    TModel,
    TModelDb,
    TQuery
  >;
  readonly #typeOrmUpdateContainerModuleApi: TypeOrmUpdateContainerModuleApi<
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

    this.#typeOrmCreationContainerModuleApi =
      new TypeOrmCreateContainerModuleApi(
        crudModuleTypeToSymbolMap,
        crudTypeOrmModuleTypeToSymbolMap,
      );
    this.#typeOrmDeleteContainerModuleApi = new TypeOrmDeleteContainerModuleApi(
      crudModuleTypeToSymbolMap,
      crudTypeOrmModuleTypeToSymbolMap,
    );
    this.#typeOrmReadContainerModuleApi = new TypeOrmReadContainerModuleApi(
      crudModuleTypeToSymbolMap,
      crudTypeOrmModuleTypeToSymbolMap,
    );
    this.#typeOrmUpdateContainerModuleApi = new TypeOrmUpdateContainerModuleApi(
      crudModuleTypeToSymbolMap,
      crudTypeOrmModuleTypeToSymbolMap,
    );
  }

  public load(container: ContainerApiService): void {
    container.bindToValue(
      this.#crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository],
      this.#repository,
    );

    this.#typeOrmCreationContainerModuleApi.load(container);
    this.#typeOrmDeleteContainerModuleApi.load(container);
    this.#typeOrmReadContainerModuleApi.load(container);
    this.#typeOrmUpdateContainerModuleApi.load(container);
  }
}
