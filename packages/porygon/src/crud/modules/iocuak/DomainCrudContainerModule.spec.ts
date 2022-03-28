jest.mock('./DomainCreateContainerModule');
jest.mock('./DomainDeleteContainerModule');
jest.mock('./DomainReadContainerModule');
jest.mock('./DomainUpdateContainerModule');

import { Container } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { DomainCreateContainerModule } from './DomainCreateContainerModule';
import { DomainCrudContainerModule } from './DomainCrudContainerModule';
import { DomainDeleteContainerModule } from './DomainDeleteContainerModule';
import { DomainReadContainerModule } from './DomainReadContainerModule';
import { DomainUpdateContainerModule } from './DomainUpdateContainerModule';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(DomainCrudContainerModule.name, () => {
  let domainCreationContainerModuleMock: jest.Mocked<
    DomainCreateContainerModule<ModelTest, QueryTest>
  >;
  let domainDeleteContainerModuleMock: jest.Mocked<
    DomainDeleteContainerModule<QueryTest>
  >;
  let domainReadContainerModuleMock: jest.Mocked<
    DomainReadContainerModule<ModelTest, QueryTest>
  >;
  let domainUpdateContainerModuleMock: jest.Mocked<
    DomainUpdateContainerModule<QueryTest>
  >;

  beforeAll(() => {
    domainCreationContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<DomainCreateContainerModule<ModelTest, QueryTest>>
    > as jest.Mocked<DomainCreateContainerModule<ModelTest, QueryTest>>;
    domainDeleteContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<DomainDeleteContainerModule<QueryTest>>
    > as jest.Mocked<DomainDeleteContainerModule<QueryTest>>;
    domainReadContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<DomainReadContainerModule<ModelTest, QueryTest>>
    > as jest.Mocked<DomainReadContainerModule<ModelTest, QueryTest>>;
    domainUpdateContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<DomainUpdateContainerModule<QueryTest>>
    > as jest.Mocked<DomainUpdateContainerModule<QueryTest>>;

    (DomainCreateContainerModule as jest.Mock).mockReturnValue(
      domainCreationContainerModuleMock,
    );
    (DomainDeleteContainerModule as jest.Mock).mockReturnValue(
      domainDeleteContainerModuleMock,
    );
    (DomainReadContainerModule as jest.Mock).mockReturnValue(
      domainReadContainerModuleMock,
    );
    (DomainUpdateContainerModule as jest.Mock).mockReturnValue(
      domainUpdateContainerModuleMock,
    );
  });

  describe('when instantiated', () => {
    let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
    let domainCrudContainerModule: DomainCrudContainerModule<
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

      domainCrudContainerModule = new DomainCrudContainerModule(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call DomainCreationContainerModule()', () => {
      expect(DomainCreateContainerModule).toHaveBeenCalledTimes(1);
      expect(DomainCreateContainerModule).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call DomainDeleteContainerModule()', () => {
      expect(DomainDeleteContainerModule).toHaveBeenCalledTimes(1);
      expect(DomainDeleteContainerModule).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call DomainReadContainerModule()', () => {
      expect(DomainReadContainerModule).toHaveBeenCalledTimes(1);
      expect(DomainReadContainerModule).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call DomainUpdateContainerModule()', () => {
      expect(DomainUpdateContainerModule).toHaveBeenCalledTimes(1);
      expect(DomainUpdateContainerModule).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    describe('.load()', () => {
      describe('when called', () => {
        let containerApiMock: jest.Mocked<Container>;

        beforeAll(() => {
          containerApiMock = {
            bind: jest.fn(),
          } as Partial<jest.Mocked<Container>> as jest.Mocked<Container>;

          domainCrudContainerModule.load(containerApiMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call DomainCreateContainerModule.load()', () => {
          expect(domainCreationContainerModuleMock.load).toHaveBeenCalledTimes(
            1,
          );
          expect(domainCreationContainerModuleMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call DomainDeleteContainerModule.load()', () => {
          expect(domainDeleteContainerModuleMock.load).toHaveBeenCalledTimes(1);
          expect(domainDeleteContainerModuleMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call DomainReadContainerModule.load()', () => {
          expect(domainReadContainerModuleMock.load).toHaveBeenCalledTimes(1);
          expect(domainReadContainerModuleMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call DomainUpdateContainerModule.load()', () => {
          expect(domainUpdateContainerModuleMock.load).toHaveBeenCalledTimes(1);
          expect(domainUpdateContainerModuleMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });
      });
    });
  });
});
