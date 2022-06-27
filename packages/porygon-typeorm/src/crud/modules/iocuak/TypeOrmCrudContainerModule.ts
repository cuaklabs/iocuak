import * as iocuak from '@cuaklabs/iocuak';
import * as porygon from '@cuaklabs/porygon';
import { Repository } from 'typeorm';

import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmCreateContainerModule } from './TypeOrmCreateContainerModule';
import { TypeOrmDeleteContainerModule } from './TypeOrmDeleteContainerModule';
import { TypeOrmReadContainerModule } from './TypeOrmReadContainerModule';
import { TypeOrmUpdateContainerModule } from './TypeOrmUpdateContainerModule';

export class TypeOrmCrudContainerModule<TModelDb>
  implements iocuak.ContainerModule
{
  readonly #crudTypeOrmModuleTypeToSymbolMap: porygon.ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  readonly #repository: Repository<TModelDb>;

  readonly #typeOrmCreationContainerModule: iocuak.ContainerModule;
  readonly #typeOrmDeleteContainerModule: iocuak.ContainerModule;
  readonly #typeOrmReadContainerModule: iocuak.ContainerModule;
  readonly #typeOrmUpdateContainerModule: iocuak.ContainerModule;

  constructor(
    crudModuleTypeToSymbolMap: porygon.ModuleTypeToSymbolMap<porygon.CrudModuleType>,
    crudTypeOrmModuleTypeToSymbolMap: porygon.ModuleTypeToSymbolMap<CrudTypeOrmModuleType>,
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

  public static forRoot<TModelDb>(
    crudModuleTypeToSymbolMap: porygon.ModuleTypeToSymbolMap<porygon.CrudModuleType>,
    crudTypeOrmModuleTypeToSymbolMap: porygon.ModuleTypeToSymbolMap<CrudTypeOrmModuleType>,
    repository: Repository<TModelDb>,
  ): iocuak.ContainerModuleMetadata {
    return {
      factory: () =>
        new TypeOrmCrudContainerModule(
          crudModuleTypeToSymbolMap,
          crudTypeOrmModuleTypeToSymbolMap,
          repository,
        ),
      imports: [
        porygon.DomainCrudContainerModule.forRoot(crudModuleTypeToSymbolMap),
      ],
    };
  }

  public load(
    containerModuleBindingService: iocuak.ContainerModuleBindingService,
  ): void {
    containerModuleBindingService.bindToValue({
      serviceId:
        this.#crudTypeOrmModuleTypeToSymbolMap[
          CrudTypeOrmModuleType.repository
        ],
      value: this.#repository,
    });

    this.#typeOrmCreationContainerModule.load(containerModuleBindingService);
    this.#typeOrmDeleteContainerModule.load(containerModuleBindingService);
    this.#typeOrmReadContainerModule.load(containerModuleBindingService);
    this.#typeOrmUpdateContainerModule.load(containerModuleBindingService);
  }
}
