import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./TypeOrmCreateContainerModule');
jest.mock('./TypeOrmDeleteContainerModule');
jest.mock('./TypeOrmReadContainerModule');
jest.mock('./TypeOrmUpdateContainerModule');

import {
  ContainerModule,
  ContainerModuleBindingService,
} from '@cuaklabs/iocuak';
import { CrudModuleType, ModuleTypeToSymbolMap } from '@cuaklabs/porygon';
import { Repository } from 'typeorm';

import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmCreateContainerModule } from './TypeOrmCreateContainerModule';
import { TypeOrmCrudContainerModule } from './TypeOrmCrudContainerModule';
import { TypeOrmDeleteContainerModule } from './TypeOrmDeleteContainerModule';
import { TypeOrmReadContainerModule } from './TypeOrmReadContainerModule';
import { TypeOrmUpdateContainerModule } from './TypeOrmUpdateContainerModule';

interface ModelTest {
  foo: string;
}

describe(TypeOrmCrudContainerModule.name, () => {
  let typeOrmCreationContainerModuleMock: jestMock.Mocked<ContainerModule>;
  let typeOrmDeleteContainerModuleMock: jestMock.Mocked<ContainerModule>;
  let typeOrmReadContainerModuleMock: jestMock.Mocked<ContainerModule>;
  let typeOrmUpdateContainerModuleMock: jestMock.Mocked<ContainerModule>;

  beforeAll(() => {
    typeOrmCreationContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerModule>
    > as jestMock.Mocked<ContainerModule>;
    typeOrmDeleteContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerModule>
    > as jestMock.Mocked<ContainerModule>;
    typeOrmReadContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerModule>
    > as jestMock.Mocked<ContainerModule>;
    typeOrmUpdateContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerModule>
    > as jestMock.Mocked<ContainerModule>;

    (TypeOrmCreateContainerModule as jestMock.Mock).mockReturnValue(
      typeOrmCreationContainerModuleMock,
    );
    (TypeOrmDeleteContainerModule as jestMock.Mock).mockReturnValue(
      typeOrmDeleteContainerModuleMock,
    );
    (TypeOrmReadContainerModule as jestMock.Mock).mockReturnValue(
      typeOrmReadContainerModuleMock,
    );
    (TypeOrmUpdateContainerModule as jestMock.Mock).mockReturnValue(
      typeOrmUpdateContainerModuleMock,
    );
  });

  describe('when instantiated', () => {
    let crudModuleTypeToSymbolMapFixture: ModuleTypeToSymbolMap<CrudModuleType>;
    let crudTypeOrmModuleTypeToSymbolMapFixture: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
    let repositoryMock: jestMock.Mocked<Repository<ModelTest>>;
    let typeOrmCrudContainerModule: TypeOrmCrudContainerModule<ModelTest>;

    beforeAll(() => {
      crudModuleTypeToSymbolMapFixture = Object.freeze({
        [CrudModuleType.createEntityAdapter]: Symbol(),
        [CrudModuleType.createEntityInteractor]: Symbol(),
        [CrudModuleType.deleteEntityAdapter]: Symbol(),
        [CrudModuleType.deleteEntityInteractor]: Symbol(),
        [CrudModuleType.readEntityAdapter]: Symbol(),
        [CrudModuleType.readManyEntityInteractor]: Symbol(),
        [CrudModuleType.readOneEntityInteractor]: Symbol(),
        [CrudModuleType.updateEntityAdapter]: Symbol(),
        [CrudModuleType.updateEntityInteractor]: Symbol(),
      });

      crudTypeOrmModuleTypeToSymbolMapFixture = Object.freeze({
        [CrudTypeOrmModuleType.findQueryToFindQueryTypeOrmConverter]: Symbol(),
        [CrudTypeOrmModuleType.insertQueryToSetTypeOrmQueryConverter]: Symbol(),
        [CrudTypeOrmModuleType.modelDbToModelConverter]: Symbol(),
        [CrudTypeOrmModuleType.repository]: Symbol(),
        [CrudTypeOrmModuleType.updateQueryToFindQueryTypeOrmConverter]:
          Symbol(),
        [CrudTypeOrmModuleType.updateQueryToSetQueryTypeOrmConverter]: Symbol(),
      });

      repositoryMock = {} as Partial<
        jestMock.Mocked<Repository<ModelTest>>
      > as jestMock.Mocked<Repository<ModelTest>>;

      typeOrmCrudContainerModule = new TypeOrmCrudContainerModule(
        crudModuleTypeToSymbolMapFixture,
        crudTypeOrmModuleTypeToSymbolMapFixture,
        repositoryMock,
      );
    });

    it('should call TypeOrmCreationContainerModule()', () => {
      expect(TypeOrmCreateContainerModule).toHaveBeenCalledTimes(1);
      expect(TypeOrmCreateContainerModule).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMapFixture,
        crudTypeOrmModuleTypeToSymbolMapFixture,
      );
    });

    it('should call TypeOrmDeleteContainerModule()', () => {
      expect(TypeOrmDeleteContainerModule).toHaveBeenCalledTimes(1);
      expect(TypeOrmDeleteContainerModule).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMapFixture,
        crudTypeOrmModuleTypeToSymbolMapFixture,
      );
    });

    it('should call TypeOrmReadContainerModule()', () => {
      expect(TypeOrmReadContainerModule).toHaveBeenCalledTimes(1);
      expect(TypeOrmReadContainerModule).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMapFixture,
        crudTypeOrmModuleTypeToSymbolMapFixture,
      );
    });

    it('should call TypeOrmUpdateContainerModule()', () => {
      expect(TypeOrmUpdateContainerModule).toHaveBeenCalledTimes(1);
      expect(TypeOrmUpdateContainerModule).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMapFixture,
        crudTypeOrmModuleTypeToSymbolMapFixture,
      );
    });

    describe('.load()', () => {
      describe('when called', () => {
        let containerApiMock: jestMock.Mocked<ContainerModuleBindingService>;

        beforeAll(() => {
          containerApiMock = {
            bind: jest.fn(),
            bindToValue: jest.fn(),
          } as Partial<
            jestMock.Mocked<ContainerModuleBindingService>
          > as jestMock.Mocked<ContainerModuleBindingService>;

          typeOrmCrudContainerModule.load(containerApiMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call container.bindToValue()', () => {
          expect(containerApiMock.bindToValue).toHaveBeenCalledTimes(1);
          expect(containerApiMock.bindToValue).toHaveBeenCalledWith({
            serviceId:
              crudTypeOrmModuleTypeToSymbolMapFixture[
                CrudTypeOrmModuleType.repository
              ],
            value: repositoryMock,
          });
        });

        it('should call TypeOrmCreateContainerModule.load()', () => {
          expect(typeOrmCreationContainerModuleMock.load).toHaveBeenCalledTimes(
            1,
          );
          expect(typeOrmCreationContainerModuleMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call TypeOrmDeleteContainerModule.load()', () => {
          expect(typeOrmDeleteContainerModuleMock.load).toHaveBeenCalledTimes(
            1,
          );
          expect(typeOrmDeleteContainerModuleMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call TypeOrmReadContainerModule.load()', () => {
          expect(typeOrmReadContainerModuleMock.load).toHaveBeenCalledTimes(1);
          expect(typeOrmReadContainerModuleMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call TypeOrmUpdateContainerModule.load()', () => {
          expect(typeOrmUpdateContainerModuleMock.load).toHaveBeenCalledTimes(
            1,
          );
          expect(typeOrmUpdateContainerModuleMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });
      });
    });
  });
});
