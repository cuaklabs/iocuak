import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

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
  let domainCreationContainerModuleMock: jestMock.Mocked<ContainerModule>;
  let domainDeleteContainerModuleMock: jestMock.Mocked<ContainerModule>;
  let domainReadContainerModuleMock: jestMock.Mocked<ContainerModule>;
  let domainUpdateContainerModuleMock: jestMock.Mocked<ContainerModule>;

  beforeAll(() => {
    domainCreationContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerModule>
    > as jestMock.Mocked<ContainerModule>;
    domainDeleteContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerModule>
    > as jestMock.Mocked<ContainerModule>;
    domainReadContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerModule>
    > as jestMock.Mocked<ContainerModule>;
    domainUpdateContainerModuleMock = {
      load: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerModule>
    > as jestMock.Mocked<ContainerModule>;

    (DomainCreateContainerModule as jestMock.Mock).mockReturnValue(
      domainCreationContainerModuleMock,
    );
    (DomainDeleteContainerModule as jestMock.Mock).mockReturnValue(
      domainDeleteContainerModuleMock,
    );
    (DomainReadContainerModule as jestMock.Mock).mockReturnValue(
      domainReadContainerModuleMock,
    );
    (DomainUpdateContainerModule as jestMock.Mock).mockReturnValue(
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
        let containerModuleBindingServiceMock: jestMock.Mocked<ContainerModuleBindingService>;

        beforeAll(() => {
          containerModuleBindingServiceMock = {
            bind: jest.fn(),
          } as Partial<
            jestMock.Mocked<ContainerModuleBindingService>
          > as jestMock.Mocked<ContainerModuleBindingService>;

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
