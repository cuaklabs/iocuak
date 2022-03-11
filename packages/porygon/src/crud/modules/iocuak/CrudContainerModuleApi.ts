import { ContainerApiService, ContainerModuleApi } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { CreationContainerModuleApi } from './CreationContainerModuleApi';
import { DeleteContainerModuleApi } from './DeleteContainerModuleApi';
import { ReadContainerModuleApi } from './ReadContainerModuleApi';
import { UpdateContainerModuleApi } from './UpdateContainerModuleApi';

export class CrudContainerModuleApi<TModel, TQuery>
  implements ContainerModuleApi
{
  readonly #creationContainerModuleApi: CreationContainerModuleApi<
    TModel,
    TQuery
  >;
  readonly #deleteContainerModuleApi: DeleteContainerModuleApi<TQuery>;
  readonly #readContainerModuleApi: ReadContainerModuleApi<TModel, TQuery>;
  readonly #updateContainerModuleApi: UpdateContainerModuleApi<TQuery>;

  constructor(
    crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>,
  ) {
    this.#creationContainerModuleApi = new CreationContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
    this.#deleteContainerModuleApi = new DeleteContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
    this.#readContainerModuleApi = new ReadContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
    this.#updateContainerModuleApi = new UpdateContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
  }

  public load(container: ContainerApiService): void {
    this.#creationContainerModuleApi.load(container);
    this.#deleteContainerModuleApi.load(container);
    this.#readContainerModuleApi.load(container);
    this.#updateContainerModuleApi.load(container);
  }
}
