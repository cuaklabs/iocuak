import {
  ContainerServiceApi,
  ContainerModuleApi,
  inject,
  injectable,
  Newable,
  ServiceId,
  TaskScopeApi,
} from '@cuaklabs/iocuak';
import {
  ConverterAsync,
  CreateEntityPort,
  CrudModuleType,
  ModuleTypeToSymbolMap,
} from '@cuaklabs/porygon';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { InsertTypeOrmAdapter } from '../../adapter/typeorm/InsertTypeOrmAdapter';
import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';

export class TypeOrmCreateContainerModuleApi<TModel, TModelDb, TQuery>
  implements ContainerModuleApi
{
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  readonly #insertTypeOrmAdapterType: Newable<
    CreateEntityPort<TModel, TQuery>,
    [
      Repository<TModelDb>,
      ConverterAsync<TModelDb, TModel>,
      ConverterAsync<
        TQuery,
        QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[]
      >,
    ]
  >;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
    crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>,
  ) {
    this.#crudModuleTypeToSymbolMap = crudModuleTypeToSymbolMap;
    this.#crudTypeOrmModuleTypeToSymbolMap = crudTypeOrmModuleTypeToSymbolMap;

    this.#insertTypeOrmAdapterType = class extends InsertTypeOrmAdapter<
      TModel,
      TModelDb,
      TQuery
    > {};
  }

  public load(container: ContainerServiceApi): void {
    this.#loadInsertTypeOrmAdapter(container);
  }

  #loadInsertTypeOrmAdapter(container: ContainerServiceApi): void {
    this.#decorateInsertTypeOrmAdapterInjectable();
    this.#decorateInsertTypeOrmAdapterRepository();
    this.#decorateInsertTypeOrmAdapterModelDbToModelConverter();
    this.#decorateInsertTypeOrmAdapterInsertQueryToSetTypeOrmQueryConverter();

    container.bind(this.#insertTypeOrmAdapterType);
  }

  #decorateInsertTypeOrmAdapterInjectable(): void {
    const createEntityAdapterServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.createEntityAdapter];

    injectable({
      id: createEntityAdapterServiceId,
      scope: TaskScopeApi.singleton,
    })(this.#insertTypeOrmAdapterType);
  }

  #decorateInsertTypeOrmAdapterRepository(): void {
    const repositoryServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository];

    inject(repositoryServiceId)(
      this.#insertTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      0,
    );
  }

  #decorateInsertTypeOrmAdapterModelDbToModelConverter(): void {
    const modelDbToModelConverterServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[
        CrudTypeOrmModuleType.modelDbToModelConverter
      ];

    inject(modelDbToModelConverterServiceId)(
      this.#insertTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      1,
    );
  }

  #decorateInsertTypeOrmAdapterInsertQueryToSetTypeOrmQueryConverter(): void {
    const insertQueryToSetTypeOrmQueryConverterServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[
        CrudTypeOrmModuleType.insertQueryToSetTypeOrmQueryConverter
      ];

    inject(insertQueryToSetTypeOrmQueryConverterServiceId)(
      this.#insertTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      2,
    );
  }
}
