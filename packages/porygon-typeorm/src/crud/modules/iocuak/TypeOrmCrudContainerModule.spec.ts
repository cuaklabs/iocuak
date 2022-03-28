jest.mock('./TypeOrmCreateContainerModule');
jest.mock('./TypeOrmDeleteContainerModule');
jest.mock('./TypeOrmReadContainerModule');
jest.mock('./TypeOrmUpdateContainerModule');

import { Container } from '@cuaklabs/iocuak';
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

interface QueryTest {
  bar: string;
}

describe(TypeOrmCrudContainerModule.name, () => {
  let typeOrmCreationContainerModuleMock: jest.Mocked<
    TypeOrmCreateContainerModule<ModelTest, ModelTest, QueryTest>
  >;
  let typeOrmDeleteContainerModuleMock: jest.Mocked<
    TypeOrmDeleteContainerModule<ModelTest, QueryTest>
  >;
  let typeOrmReadContainerModuleMock: jest.Mocked<
    TypeOrmReadContainerModule<ModelTest, ModelTest, QueryTest>
  >;
  let typeOrmUpdateContainerModuleMock: jest.Mocked<
    TypeOrmUpdateContainerModule<ModelTest, QueryTest>
  >;

  beforeAll(() => {
    typeOrmCreationContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<TypeOrmCreateContainerModule<ModelTest, ModelTest, QueryTest>>
    > as jest.Mocked<
      TypeOrmCreateContainerModule<ModelTest, ModelTest, QueryTest>
    >;
    typeOrmDeleteContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<TypeOrmDeleteContainerModule<ModelTest, QueryTest>>
    > as jest.Mocked<TypeOrmDeleteContainerModule<ModelTest, QueryTest>>;
    typeOrmReadContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<TypeOrmReadContainerModule<ModelTest, ModelTest, QueryTest>>
    > as jest.Mocked<
      TypeOrmReadContainerModule<ModelTest, ModelTest, QueryTest>
    >;
    typeOrmUpdateContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<TypeOrmUpdateContainerModule<ModelTest, QueryTest>>
    > as jest.Mocked<TypeOrmUpdateContainerModule<ModelTest, QueryTest>>;

    (TypeOrmCreateContainerModule as jest.Mock).mockReturnValue(
      typeOrmCreationContainerModuleMock,
    );
    (TypeOrmDeleteContainerModule as jest.Mock).mockReturnValue(
      typeOrmDeleteContainerModuleMock,
    );
    (TypeOrmReadContainerModule as jest.Mock).mockReturnValue(
      typeOrmReadContainerModuleMock,
    );
    (TypeOrmUpdateContainerModule as jest.Mock).mockReturnValue(
      typeOrmUpdateContainerModuleMock,
    );
  });

  describe('when instantiated', () => {
    let crudModuleTypeToSymbolMapFixture: ModuleTypeToSymbolMap<CrudModuleType>;
    let crudTypeOrmModuleTypeToSymbolMapFixture: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
    let repositoryMock: jest.Mocked<Repository<ModelTest>>;
    let typeOrmCrudContainerModule: TypeOrmCrudContainerModule<
      ModelTest,
      ModelTest,
      QueryTest
    >;

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
        jest.Mocked<Repository<ModelTest>>
      > as jest.Mocked<Repository<ModelTest>>;

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
        let containerApiMock: jest.Mocked<Container>;

        beforeAll(() => {
          containerApiMock = {
            bind: jest.fn(),
            bindToValue: jest.fn(),
          } as Partial<jest.Mocked<Container>> as jest.Mocked<Container>;

          typeOrmCrudContainerModule.load(containerApiMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call container.bindToValue()', () => {
          expect(containerApiMock.bindToValue).toHaveBeenCalledTimes(1);
          expect(containerApiMock.bindToValue).toHaveBeenCalledWith(
            crudTypeOrmModuleTypeToSymbolMapFixture[
              CrudTypeOrmModuleType.repository
            ],
            repositoryMock,
          );
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
