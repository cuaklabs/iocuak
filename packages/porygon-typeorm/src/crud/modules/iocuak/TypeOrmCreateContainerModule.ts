import {
  ContainerService,
  ContainerModule,
  inject,
  injectable,
  Newable,
  ServiceId,
  TaskScope,
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

export class TypeOrmCreateContainerModule<TModel, TModelDb, TQuery>
  implements ContainerModule
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

  public load(container: ContainerService): void {
    this.#loadInsertTypeOrmAdapter(container);
  }

  #loadInsertTypeOrmAdapter(container: ContainerService): void {
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
      scope: TaskScope.singleton,
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
