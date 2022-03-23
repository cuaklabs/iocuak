jest.mock('./TypeOrmCreateContainerModuleApi');
jest.mock('./TypeOrmDeleteContainerModuleApi');
jest.mock('./TypeOrmReadContainerModuleApi');
jest.mock('./TypeOrmUpdateContainerModuleApi');

import { ContainerApi } from '@cuaklabs/iocuak';
import { CrudModuleType, ModuleTypeToSymbolMap } from '@cuaklabs/porygon';
import { Repository } from 'typeorm';

import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmCreateContainerModuleApi } from './TypeOrmCreateContainerModuleApi';
import { TypeOrmCrudContainerModuleApi } from './TypeOrmCrudContainerModuleApi';
import { TypeOrmDeleteContainerModuleApi } from './TypeOrmDeleteContainerModuleApi';
import { TypeOrmReadContainerModuleApi } from './TypeOrmReadContainerModuleApi';
import { TypeOrmUpdateContainerModuleApi } from './TypeOrmUpdateContainerModuleApi';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(TypeOrmCrudContainerModuleApi.name, () => {
  let typeOrmCreationContainerModuleApiMock: jest.Mocked<
    TypeOrmCreateContainerModuleApi<ModelTest, ModelTest, QueryTest>
  >;
  let typeOrmDeleteContainerModuleApiMock: jest.Mocked<
    TypeOrmDeleteContainerModuleApi<ModelTest, QueryTest>
  >;
  let typeOrmReadContainerModuleApiMock: jest.Mocked<
    TypeOrmReadContainerModuleApi<ModelTest, ModelTest, QueryTest>
  >;
  let typeOrmUpdateContainerModuleApiMock: jest.Mocked<
    TypeOrmUpdateContainerModuleApi<ModelTest, QueryTest>
  >;

  beforeAll(() => {
    typeOrmCreationContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<
        TypeOrmCreateContainerModuleApi<ModelTest, ModelTest, QueryTest>
      >
    > as jest.Mocked<
      TypeOrmCreateContainerModuleApi<ModelTest, ModelTest, QueryTest>
    >;
    typeOrmDeleteContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<TypeOrmDeleteContainerModuleApi<ModelTest, QueryTest>>
    > as jest.Mocked<TypeOrmDeleteContainerModuleApi<ModelTest, QueryTest>>;
    typeOrmReadContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<
        TypeOrmReadContainerModuleApi<ModelTest, ModelTest, QueryTest>
      >
    > as jest.Mocked<
      TypeOrmReadContainerModuleApi<ModelTest, ModelTest, QueryTest>
    >;
    typeOrmUpdateContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<TypeOrmUpdateContainerModuleApi<ModelTest, QueryTest>>
    > as jest.Mocked<TypeOrmUpdateContainerModuleApi<ModelTest, QueryTest>>;

    (TypeOrmCreateContainerModuleApi as jest.Mock).mockReturnValue(
      typeOrmCreationContainerModuleApiMock,
    );
    (TypeOrmDeleteContainerModuleApi as jest.Mock).mockReturnValue(
      typeOrmDeleteContainerModuleApiMock,
    );
    (TypeOrmReadContainerModuleApi as jest.Mock).mockReturnValue(
      typeOrmReadContainerModuleApiMock,
    );
    (TypeOrmUpdateContainerModuleApi as jest.Mock).mockReturnValue(
      typeOrmUpdateContainerModuleApiMock,
    );
  });

  describe('when instantiated', () => {
    let crudModuleTypeToSymbolMapFixture: ModuleTypeToSymbolMap<CrudModuleType>;
    let crudTypeOrmModuleTypeToSymbolMapFixture: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
    let repositoryMock: jest.Mocked<Repository<ModelTest>>;
    let typeOrmCrudContainerModuleApi: TypeOrmCrudContainerModuleApi<
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

      typeOrmCrudContainerModuleApi = new TypeOrmCrudContainerModuleApi(
        crudModuleTypeToSymbolMapFixture,
        crudTypeOrmModuleTypeToSymbolMapFixture,
        repositoryMock,
      );
    });

    it('should call TypeOrmCreationContainerModuleApi()', () => {
      expect(TypeOrmCreateContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(TypeOrmCreateContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMapFixture,
        crudTypeOrmModuleTypeToSymbolMapFixture,
      );
    });

    it('should call TypeOrmDeleteContainerModuleApi()', () => {
      expect(TypeOrmDeleteContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(TypeOrmDeleteContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMapFixture,
        crudTypeOrmModuleTypeToSymbolMapFixture,
      );
    });

    it('should call TypeOrmReadContainerModuleApi()', () => {
      expect(TypeOrmReadContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(TypeOrmReadContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMapFixture,
        crudTypeOrmModuleTypeToSymbolMapFixture,
      );
    });

    it('should call TypeOrmUpdateContainerModuleApi()', () => {
      expect(TypeOrmUpdateContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(TypeOrmUpdateContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMapFixture,
        crudTypeOrmModuleTypeToSymbolMapFixture,
      );
    });

    describe('.load()', () => {
      describe('when called', () => {
        let containerApiMock: jest.Mocked<ContainerApi>;

        beforeAll(() => {
          containerApiMock = {
            bind: jest.fn(),
            bindToValue: jest.fn(),
          } as Partial<jest.Mocked<ContainerApi>> as jest.Mocked<ContainerApi>;

          typeOrmCrudContainerModuleApi.load(containerApiMock);
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

        it('should call TypeOrmCreateContainerModuleApi.load()', () => {
          expect(
            typeOrmCreationContainerModuleApiMock.load,
          ).toHaveBeenCalledTimes(1);
          expect(
            typeOrmCreationContainerModuleApiMock.load,
          ).toHaveBeenCalledWith(containerApiMock);
        });

        it('should call TypeOrmDeleteContainerModuleApi.load()', () => {
          expect(
            typeOrmDeleteContainerModuleApiMock.load,
          ).toHaveBeenCalledTimes(1);
          expect(typeOrmDeleteContainerModuleApiMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call TypeOrmReadContainerModuleApi.load()', () => {
          expect(typeOrmReadContainerModuleApiMock.load).toHaveBeenCalledTimes(
            1,
          );
          expect(typeOrmReadContainerModuleApiMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call TypeOrmUpdateContainerModuleApi.load()', () => {
          expect(
            typeOrmUpdateContainerModuleApiMock.load,
          ).toHaveBeenCalledTimes(1);
          expect(typeOrmUpdateContainerModuleApiMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });
      });
    });
  });
});
