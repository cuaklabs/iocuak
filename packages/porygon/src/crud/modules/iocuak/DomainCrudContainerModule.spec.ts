jest.mock('./DomainCreateContainerModule');
jest.mock('./DomainDeleteContainerModule');
jest.mock('./DomainReadContainerModule');
jest.mock('./DomainUpdateContainerModule');

import {
  ContainerModule,
  ContainerModuleBindingService,
} from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { DomainCreateContainerModule } from './DomainCreateContainerModule';
import { DomainCrudContainerModule } from './DomainCrudContainerModule';
import { DomainDeleteContainerModule } from './DomainDeleteContainerModule';
import { DomainReadContainerModule } from './DomainReadContainerModule';
import { DomainUpdateContainerModule } from './DomainUpdateContainerModule';

describe(DomainCrudContainerModule.name, () => {
  let domainCreationContainerModuleMock: jest.Mocked<ContainerModule>;
  let domainDeleteContainerModuleMock: jest.Mocked<ContainerModule>;
  let domainReadContainerModuleMock: jest.Mocked<ContainerModule>;
  let domainUpdateContainerModuleMock: jest.Mocked<ContainerModule>;

  beforeAll(() => {
    domainCreationContainerModuleMock = {
      load: jest.fn(),
    } as Partial<jest.Mocked<ContainerModule>> as jest.Mocked<ContainerModule>;
    domainDeleteContainerModuleMock = {
      load: jest.fn(),
    } as Partial<jest.Mocked<ContainerModule>> as jest.Mocked<ContainerModule>;
    domainReadContainerModuleMock = {
      load: jest.fn(),
    } as Partial<jest.Mocked<ContainerModule>> as jest.Mocked<ContainerModule>;
    domainUpdateContainerModuleMock = {
      load: jest.fn(),
    } as Partial<jest.Mocked<ContainerModule>> as jest.Mocked<ContainerModule>;

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
    let domainCrudContainerModule: DomainCrudContainerModule;

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
        let containerModuleBindingServiceMock: jest.Mocked<ContainerModuleBindingService>;

        beforeAll(() => {
          containerModuleBindingServiceMock = {
            bind: jest.fn(),
          } as Partial<
            jest.Mocked<ContainerModuleBindingService>
          > as jest.Mocked<ContainerModuleBindingService>;

          domainCrudContainerModule.load(containerModuleBindingServiceMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call DomainCreateContainerModule.load()', () => {
          expect(domainCreationContainerModuleMock.load).toHaveBeenCalledTimes(
            1,
          );
          expect(domainCreationContainerModuleMock.load).toHaveBeenCalledWith(
            containerModuleBindingServiceMock,
          );
        });

        it('should call DomainDeleteContainerModule.load()', () => {
          expect(domainDeleteContainerModuleMock.load).toHaveBeenCalledTimes(1);
          expect(domainDeleteContainerModuleMock.load).toHaveBeenCalledWith(
            containerModuleBindingServiceMock,
          );
        });

        it('should call DomainReadContainerModule.load()', () => {
          expect(domainReadContainerModuleMock.load).toHaveBeenCalledTimes(1);
          expect(domainReadContainerModuleMock.load).toHaveBeenCalledWith(
            containerModuleBindingServiceMock,
          );
        });

        it('should call DomainUpdateContainerModule.load()', () => {
          expect(domainUpdateContainerModuleMock.load).toHaveBeenCalledTimes(1);
          expect(domainUpdateContainerModuleMock.load).toHaveBeenCalledWith(
            containerModuleBindingServiceMock,
          );
        });
      });
    });
  });
});
