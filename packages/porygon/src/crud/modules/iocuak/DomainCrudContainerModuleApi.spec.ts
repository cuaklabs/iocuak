jest.mock('./DomainCreateContainerModuleApi');
jest.mock('./DomainDeleteContainerModuleApi');
jest.mock('./DomainReadContainerModuleApi');
jest.mock('./DomainUpdateContainerModuleApi');

import { ContainerApi } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { DomainCreateContainerModuleApi } from './DomainCreateContainerModuleApi';
import { DomainCrudContainerModuleApi } from './DomainCrudContainerModuleApi';
import { DomainDeleteContainerModuleApi } from './DomainDeleteContainerModuleApi';
import { DomainReadContainerModuleApi } from './DomainReadContainerModuleApi';
import { DomainUpdateContainerModuleApi } from './DomainUpdateContainerModuleApi';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(DomainCrudContainerModuleApi.name, () => {
  let domainCreationContainerModuleApiMock: jest.Mocked<
    DomainCreateContainerModuleApi<ModelTest, QueryTest>
  >;
  let domainDeleteContainerModuleApiMock: jest.Mocked<
    DomainDeleteContainerModuleApi<QueryTest>
  >;
  let domainReadContainerModuleApiMock: jest.Mocked<
    DomainReadContainerModuleApi<ModelTest, QueryTest>
  >;
  let domainUpdateContainerModuleApiMock: jest.Mocked<
    DomainUpdateContainerModuleApi<QueryTest>
  >;

  beforeAll(() => {
    domainCreationContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<DomainCreateContainerModuleApi<ModelTest, QueryTest>>
    > as jest.Mocked<DomainCreateContainerModuleApi<ModelTest, QueryTest>>;
    domainDeleteContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<DomainDeleteContainerModuleApi<QueryTest>>
    > as jest.Mocked<DomainDeleteContainerModuleApi<QueryTest>>;
    domainReadContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<DomainReadContainerModuleApi<ModelTest, QueryTest>>
    > as jest.Mocked<DomainReadContainerModuleApi<ModelTest, QueryTest>>;
    domainUpdateContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<DomainUpdateContainerModuleApi<QueryTest>>
    > as jest.Mocked<DomainUpdateContainerModuleApi<QueryTest>>;

    (DomainCreateContainerModuleApi as jest.Mock).mockReturnValue(
      domainCreationContainerModuleApiMock,
    );
    (DomainDeleteContainerModuleApi as jest.Mock).mockReturnValue(
      domainDeleteContainerModuleApiMock,
    );
    (DomainReadContainerModuleApi as jest.Mock).mockReturnValue(
      domainReadContainerModuleApiMock,
    );
    (DomainUpdateContainerModuleApi as jest.Mock).mockReturnValue(
      domainUpdateContainerModuleApiMock,
    );
  });

  describe('when instantiated', () => {
    let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
    let domainCrudContainerModuleApi: DomainCrudContainerModuleApi<
      ModelTest,
      QueryTest
    >;

    beforeAll(() => {
      crudModuleTypeToSymbolMap = Object.freeze({
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

      domainCrudContainerModuleApi = new DomainCrudContainerModuleApi(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call DomainCreationContainerModuleApi()', () => {
      expect(DomainCreateContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(DomainCreateContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call DomainDeleteContainerModuleApi()', () => {
      expect(DomainDeleteContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(DomainDeleteContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call DomainReadContainerModuleApi()', () => {
      expect(DomainReadContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(DomainReadContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call DomainUpdateContainerModuleApi()', () => {
      expect(DomainUpdateContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(DomainUpdateContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    describe('.load()', () => {
      describe('when called', () => {
        let containerApiMock: jest.Mocked<ContainerApi>;

        beforeAll(() => {
          containerApiMock = {
            bind: jest.fn(),
          } as Partial<jest.Mocked<ContainerApi>> as jest.Mocked<ContainerApi>;

          domainCrudContainerModuleApi.load(containerApiMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call DomainCreateContainerModuleApi.load()', () => {
          expect(
            domainCreationContainerModuleApiMock.load,
          ).toHaveBeenCalledTimes(1);
          expect(
            domainCreationContainerModuleApiMock.load,
          ).toHaveBeenCalledWith(containerApiMock);
        });

        it('should call DomainDeleteContainerModuleApi.load()', () => {
          expect(domainDeleteContainerModuleApiMock.load).toHaveBeenCalledTimes(
            1,
          );
          expect(domainDeleteContainerModuleApiMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call DomainReadContainerModuleApi.load()', () => {
          expect(domainReadContainerModuleApiMock.load).toHaveBeenCalledTimes(
            1,
          );
          expect(domainReadContainerModuleApiMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call DomainUpdateContainerModuleApi.load()', () => {
          expect(domainUpdateContainerModuleApiMock.load).toHaveBeenCalledTimes(
            1,
          );
          expect(domainUpdateContainerModuleApiMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });
      });
    });
  });
});
