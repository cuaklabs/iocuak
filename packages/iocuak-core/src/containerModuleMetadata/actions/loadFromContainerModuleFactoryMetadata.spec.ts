import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ClassElementMetadataType } from '@cuaklabs/iocuak-models';

jest.mock('../../createInstanceTask/actions/getDependency');

import { BindingService } from '../../binding/services/BindingService';
import { ContainerModule } from '../../containerModule/models/ContainerModule';
import { ContainerModuleFactoryMetadata } from '../../containerModuleMetadata/models/ContainerModuleFactoryMetadata';
import { getDependency } from '../../createInstanceTask/actions/getDependency';
import { TaskContextServices } from '../../createInstanceTask/models/TaskContextServices';
import { ContainerModuleMetadataMocks } from '../mocks/models/ContainerModuleMetadataMocks';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { loadFromContainerModuleFactoryMetadata } from './loadFromContainerModuleFactoryMetadata';

describe(loadFromContainerModuleFactoryMetadata.name, () => {
  let containerModuleFactoryMetadataMock: jest.Mocked<ContainerModuleFactoryMetadata>;

  beforeAll(() => {
    containerModuleFactoryMetadataMock = {
      ...ContainerModuleMetadataMocks.withTypeFactory,
      injects: [
        {
          type: ClassElementMetadataType.serviceId,
          value: Symbol(),
        },
      ],
    };
  });

  describe('when called, and containerModuleFactoryMetadataMock.factory() returns a Promise<ContainerModule>', () => {
    let taskContextMock: LoadModuleMetadataTaskContext;
    let containerModuleMock: jest.Mocked<ContainerModule>;
    let factoryParameterFixture: unknown;

    let result: unknown;

    beforeAll(async () => {
      taskContextMock = {
        services: {
          bindingService: {
            [Symbol()]: Symbol(),
          } as unknown as BindingService,
        } as Partial<TaskContextServices> as TaskContextServices,
      } as Partial<LoadModuleMetadataTaskContext> as LoadModuleMetadataTaskContext;

      containerModuleMock = {
        load: jest.fn(),
      };

      factoryParameterFixture = Symbol();

      (getDependency as jest.Mock<typeof getDependency>).mockReturnValueOnce(
        factoryParameterFixture,
      );

      containerModuleFactoryMetadataMock.factory.mockReturnValueOnce(
        Promise.resolve(containerModuleMock),
      );

      result = await loadFromContainerModuleFactoryMetadata(
        containerModuleFactoryMetadataMock,
        taskContextMock,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call createInstance()', () => {
      const expectedTaskContext: LoadModuleMetadataTaskContext = {
        ...taskContextMock,
        servicesInstantiatedSet: new Set(),
      };

      expect(getDependency).toHaveBeenCalledTimes(1);
      expect(getDependency).toHaveBeenCalledWith(
        containerModuleFactoryMetadataMock.injects[0],
        expectedTaskContext,
      );
    });

    it('should call containerModuleFactoryMetadata.factory()', () => {
      expect(containerModuleFactoryMetadataMock.factory).toHaveBeenCalledTimes(
        1,
      );
      expect(containerModuleFactoryMetadataMock.factory).toHaveBeenCalledWith(
        factoryParameterFixture,
      );
    });

    it('should call containerModule.load()', () => {
      expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
      expect(containerModuleMock.load).toHaveBeenCalledWith(
        taskContextMock.services.bindingService,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when called, and containerModuleFactoryMetadataMock.factory() returns a ContainerModule', () => {
    let taskContextMock: LoadModuleMetadataTaskContext;
    let containerModuleMock: jest.Mocked<ContainerModule>;
    let factoryParameterFixture: unknown;

    let result: unknown;

    beforeAll(async () => {
      taskContextMock = {
        services: {
          bindingService: {
            [Symbol()]: Symbol(),
          } as unknown as BindingService,
        } as Partial<TaskContextServices> as TaskContextServices,
      } as Partial<LoadModuleMetadataTaskContext> as LoadModuleMetadataTaskContext;

      containerModuleMock = {
        load: jest.fn(),
      };

      factoryParameterFixture = Symbol();

      (getDependency as jest.Mock<typeof getDependency>).mockReturnValueOnce(
        factoryParameterFixture,
      );

      containerModuleFactoryMetadataMock.factory.mockReturnValueOnce(
        containerModuleMock,
      );

      result = await loadFromContainerModuleFactoryMetadata(
        containerModuleFactoryMetadataMock,
        taskContextMock,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call createInstance()', () => {
      const expectedTaskContext: LoadModuleMetadataTaskContext = {
        ...taskContextMock,
        servicesInstantiatedSet: new Set(),
      };

      expect(getDependency).toHaveBeenCalledTimes(1);
      expect(getDependency).toHaveBeenCalledWith(
        containerModuleFactoryMetadataMock.injects[0],
        expectedTaskContext,
      );
    });

    it('should call containerModuleFactoryMetadata.factory()', () => {
      expect(containerModuleFactoryMetadataMock.factory).toHaveBeenCalledTimes(
        1,
      );
      expect(containerModuleFactoryMetadataMock.factory).toHaveBeenCalledWith(
        factoryParameterFixture,
      );
    });

    it('should call containerModule.load()', () => {
      expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
      expect(containerModuleMock.load).toHaveBeenCalledWith(
        taskContextMock.services.bindingService,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
