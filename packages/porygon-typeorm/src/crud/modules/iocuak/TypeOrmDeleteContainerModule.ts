import {
  BindingScope,
  ContainerService,
  ContainerModule,
  inject,
  injectable,
  Newable,
  ServiceId,
} from '@cuaklabs/iocuak';
import {
  CrudModuleType,
  DeleteEntityPort,
  ModuleTypeToSymbolMap,
} from '@cuaklabs/porygon';
import { Repository } from 'typeorm';

import { DeleteTypeOrmAdapter } from '../../adapter/typeorm/DeleteTypeOrmAdapter';
import { QueryToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryToFindQueryTypeOrmConverter';
import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';

export class TypeOrmDeleteContainerModule<TModelDb, TQuery>
  implements ContainerModule
{
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  readonly #deleteTypeOrmAdapterType: Newable<
    DeleteEntityPort<TQuery>,
    [Repository<TModelDb>, QueryToFindQueryTypeOrmConverter<TModelDb, TQuery>]
  >;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
    crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>,
  ) {
    this.#crudModuleTypeToSymbolMap = crudModuleTypeToSymbolMap;
    this.#crudTypeOrmModuleTypeToSymbolMap = crudTypeOrmModuleTypeToSymbolMap;

    this.#deleteTypeOrmAdapterType = class extends DeleteTypeOrmAdapter<
      TModelDb,
      TQuery
    > {};
  }

  public load(container: ContainerService): void {
    this.#loadDeleteTypeOrmAdapter(container);
  }

  #loadDeleteTypeOrmAdapter(container: ContainerService): void {
    this.#decorateDeleteTypeOrmAdapterInjectable();
    this.#decorateDeleteTypeOrmAdapterRepository();
    this.#decorateDeleteTypeOrmAdapterFindQueryToFindQueryTypeOrmConverter();

    container.bind(this.#deleteTypeOrmAdapterType);
  }

  #decorateDeleteTypeOrmAdapterInjectable(): void {
    const deleteEntityAdapterServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.deleteEntityAdapter];

    injectable({
      id: deleteEntityAdapterServiceId,
      scope: BindingScope.singleton,
    })(this.#deleteTypeOrmAdapterType);
  }

  #decorateDeleteTypeOrmAdapterRepository(): void {
    const repositoryServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository];

    inject(repositoryServiceId)(
      this.#deleteTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      0,
    );
  }

  #decorateDeleteTypeOrmAdapterFindQueryToFindQueryTypeOrmConverter(): void {
    const findQueryToFindQueryTypeOrmConverterServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[
        CrudTypeOrmModuleType.findQueryToFindQueryTypeOrmConverter
      ];

    inject(findQueryToFindQueryTypeOrmConverterServiceId)(
      this.#deleteTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      1,
    );
  }
}
