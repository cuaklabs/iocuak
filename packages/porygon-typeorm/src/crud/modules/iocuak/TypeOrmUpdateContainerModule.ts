import {
  BindingScope,
  ContainerModule,
  ContainerModuleBindingService,
  inject,
  injectable,
  Newable,
  ServiceId,
} from '@cuaklabs/iocuak';
import {
  CrudModuleType,
  UpdateEntityPort,
  ModuleTypeToSymbolMap,
  ConverterAsync,
} from '@cuaklabs/porygon';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { UpdateTypeOrmAdapter } from '../../adapter/typeorm/UpdateTypeOrmAdapter';
import { QueryToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryToFindQueryTypeOrmConverter';
import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';

export class TypeOrmUpdateContainerModule<TModelDb, TQuery>
  implements ContainerModule
{
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  readonly #updateTypeOrmAdapterType: Newable<
    UpdateEntityPort<TQuery>,
    [
      Repository<TModelDb>,
      QueryToFindQueryTypeOrmConverter<TModelDb, TQuery>,
      ConverterAsync<TQuery, QueryDeepPartialEntity<TModelDb>>,
    ]
  >;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
    crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>,
  ) {
    this.#crudModuleTypeToSymbolMap = crudModuleTypeToSymbolMap;
    this.#crudTypeOrmModuleTypeToSymbolMap = crudTypeOrmModuleTypeToSymbolMap;

    this.#updateTypeOrmAdapterType = class extends UpdateTypeOrmAdapter<
      TModelDb,
      TQuery
    > {};
  }

  public load(
    containerModuleBindingService: ContainerModuleBindingService,
  ): void {
    this.#loadUpdateTypeOrmAdapter(containerModuleBindingService);
  }

  #loadUpdateTypeOrmAdapter(
    containerModuleBindingService: ContainerModuleBindingService,
  ): void {
    this.#decorateUpdateTypeOrmAdapterInjectable();
    this.#decorateUpdateTypeOrmAdapterRepository();
    this.#decorateUpdateTypeOrmAdapterUpdateQueryToFindQueryTypeOrmConverter();
    this.#decorateUpdateTypeOrmAdapterUpdateQueryToSetQueryTypeOrmConverter();

    containerModuleBindingService.bind(this.#updateTypeOrmAdapterType);
  }

  #decorateUpdateTypeOrmAdapterInjectable(): void {
    const updateEntityAdapterServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.updateEntityAdapter];

    injectable({
      id: updateEntityAdapterServiceId,
      scope: BindingScope.singleton,
    })(this.#updateTypeOrmAdapterType);
  }

  #decorateUpdateTypeOrmAdapterRepository(): void {
    const repositoryServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository];

    inject(repositoryServiceId)(
      this.#updateTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      0,
    );
  }

  #decorateUpdateTypeOrmAdapterUpdateQueryToFindQueryTypeOrmConverter(): void {
    const updateQueryToFindQueryTypeOrmConverterServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[
        CrudTypeOrmModuleType.updateQueryToFindQueryTypeOrmConverter
      ];

    inject(updateQueryToFindQueryTypeOrmConverterServiceId)(
      this.#updateTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      1,
    );
  }

  #decorateUpdateTypeOrmAdapterUpdateQueryToSetQueryTypeOrmConverter(): void {
    const updateQueryToSetQueryTypeOrmConverterServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[
        CrudTypeOrmModuleType.updateQueryToSetQueryTypeOrmConverter
      ];

    inject(updateQueryToSetQueryTypeOrmConverterServiceId)(
      this.#updateTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      2,
    );
  }
}
