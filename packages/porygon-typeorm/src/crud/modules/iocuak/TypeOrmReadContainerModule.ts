import {
  BindingScope,
  ContainerModule,
  inject,
  injectable,
  Newable,
  ServiceId,
  ContainerModuleBindingService,
} from '@cuaklabs/iocuak';
import {
  CrudModuleType,
  FindEntityPort,
  ModuleTypeToSymbolMap,
  ConverterAsync,
} from '@cuaklabs/porygon';
import { Repository } from 'typeorm';

import { FindTypeOrmAdapter } from '../../adapter/typeorm/FindTypeOrmAdapter';
import { QueryToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryToFindQueryTypeOrmConverter';
import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';

export class TypeOrmReadContainerModule<TModel, TModelDb, TQuery>
  implements ContainerModule
{
  readonly #crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  readonly #crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  readonly #readTypeOrmAdapterType: Newable<
    FindEntityPort<TModel, TQuery>,
    [
      Repository<TModelDb>,
      ConverterAsync<TModelDb, TModel>,
      QueryToFindQueryTypeOrmConverter<TModelDb, TQuery>,
    ]
  >;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
    crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>,
  ) {
    this.#crudModuleTypeToSymbolMap = crudModuleTypeToSymbolMap;
    this.#crudTypeOrmModuleTypeToSymbolMap = crudTypeOrmModuleTypeToSymbolMap;

    this.#readTypeOrmAdapterType = class extends FindTypeOrmAdapter<
      TModel,
      TModelDb,
      TQuery
    > {};
  }

  public load(
    containerModuleBindingService: ContainerModuleBindingService,
  ): void {
    this.#loadFindTypeOrmAdapter(containerModuleBindingService);
  }

  #loadFindTypeOrmAdapter(
    containerModuleBindingService: ContainerModuleBindingService,
  ): void {
    this.#decorateFindTypeOrmAdapterInjectable();
    this.#decorateFindTypeOrmAdapterRepository();
    this.#decorateModelDbToModelConverter();
    this.#decorateFindQueryToFindQueryTypeOrmConverter();

    containerModuleBindingService.bind(this.#readTypeOrmAdapterType);
  }

  #decorateFindTypeOrmAdapterInjectable(): void {
    const readEntityAdapterServiceId: ServiceId =
      this.#crudModuleTypeToSymbolMap[CrudModuleType.readEntityAdapter];

    injectable({
      id: readEntityAdapterServiceId,
      scope: BindingScope.singleton,
    })(this.#readTypeOrmAdapterType);
  }

  #decorateFindTypeOrmAdapterRepository(): void {
    const repositoryServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository];

    inject(repositoryServiceId)(
      this.#readTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      0,
    );
  }

  #decorateModelDbToModelConverter(): void {
    const modelDbToModelConverterServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[
        CrudTypeOrmModuleType.modelDbToModelConverter
      ];

    inject(modelDbToModelConverterServiceId)(
      this.#readTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      1,
    );
  }

  #decorateFindQueryToFindQueryTypeOrmConverter(): void {
    const findQueryToFindQueryTypeOrmConverterServiceId: ServiceId =
      this.#crudTypeOrmModuleTypeToSymbolMap[
        CrudTypeOrmModuleType.findQueryToFindQueryTypeOrmConverter
      ];

    inject(findQueryToFindQueryTypeOrmConverterServiceId)(
      this.#readTypeOrmAdapterType,
      undefined as unknown as string | symbol,
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      2,
    );
  }
}
